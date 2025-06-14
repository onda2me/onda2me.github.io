---
title: "구글 Cloud Translation을 이용한 언어번역 서비스 개발 (채팅형)"
categories: 
  - google
tags:
  - google
  - api
  - translation
header:
  teaser: /assets/images/post/cloud/translate02-30.png 
---

> **구글 번역(Google Translate)** API는 Google Cloud 플랫폼에서 제공하는 서비스 중 하나로, 텍스트를 한 언어에서 다른 언어로 번역하는 기능을 제공한다.
{: .notice--info}

<!-- 
![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/translate02-10.png){: style="width:600px" .image_box}  
-->

## 1. Google 번역 API의 주요 기능
  +  100개 이상의 언어간 텍스트 번역 
  +  입력한 텍스트의 자동으로 언어 감지
  +  정규화된 JSON 응답  

## 2. 채팅형 번역 서비스 개발

  + 간단한 번역서비스는 [구글 Cloud Translation을 이용한 언어번역 서비스 구축](/google/google-api-translate/){: .btn.btn--primary.btn--narrow target="_blank" } 참고    
  + 구글 클라우드 설정은 [Java Springboot 웹프로젝트의 Google Cloud Run 서비스](/google/google-run-10/){: .btn.btn--primary.btn--narrow target="_blank" } 참고

### 1) 서비스 개요
  + 서비스 목표    
  > 텍스트로 입력 된 언어를 구글 Cloud Translation API를 사용하여 번역 후 Text To Speech API를 이용하여 음성으로 변환한다.    
  > UI는 채팅형으로 구성하고, 번역한 언어의 음성듣기 기능을 추가한다.

  + 서비스 구조    
    ![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/translate02-30.png){: style="width:600px" .image_box}
  
  + UI 화면    
  [채팅형 구글번역 데모사이트 바로가기](https://ondago365.web.app/play/translate-chat.html){: .btn.btn--primary.btn--narrow target="_blank" }    
  ![Text To Speech UI ]({{ site.baseurl }}/assets/images/post/cloud/translate02-20.png){: style="width:600px" .image_box}  

### 2) Java 프로젝트 설정

  + Dto 추가    

```java    
public class GoogleTranslateDto {

    private String fromLang;     // 원본 언어 코드 (예: "ko")   
    private String fromText;     // 원본 텍스트
    
    private String toLang;       // 번역 언어 코드 (예: "en")
    private String toText;       // 번역 텍스트
}
```

  + Controller 추가    

```java  
/*
  구글공식문서 [Cloud Translation Advanced로 텍스트 번역] 참고
  https://cloud.google.com/translate/docs/advanced/translate-text-advance
*/
public class TranslateAPIController {

  private static String PROJECT_ID = "your_projectId";

  @RequestMapping(value="/translate")
  public String translate(GoogleTranslateDto dto) throws Exception {
      
    if(dto.getToText() == null || dto.getToLang() == null) {
        throw new IllegalArgumentException("No Parameter");             
    }        
    
    return translateText(dto);
  } 

  public static String translateText(GoogleTranslateDto dto) throws IOException {
        
    String translateText = null;    
    try (TranslationServiceClient client = TranslationServiceClient.create()) {
        
        //Custom Models must use the same location as your model. (us-central1)
        LocationName parent = LocationName.of(PROJECT_ID, "global");
                
        // Supported Mime Types: https://cloud.google.com/translate/docs/supported-formats
        TranslateTextRequest request =
            TranslateTextRequest.newBuilder()
                .setParent(parent.toString())
                .setMimeType("text/plain")
                .setTargetLanguageCode(dto.getToLang())
                .addContents(dto.getFromText())
                .build();

        TranslateTextResponse response = client.translateText(request);
        
        // Display the translation for each input text provided
        for (Translation translation : response.getTranslationsList()) {                
            translateText = translation.getTranslatedText();
        }
    }
   
    return translateText;  
  }    
}
```

  + UI (translate-chat.html) 추가    

```html    
<!-- 
  UI 주요 부분 (bootstrap v5.3 참고)
  https://getbootstrap.com/docs/5.3/utilities/flex/
 -->
<form id="frm" name="frm"  action="#">
  <input type="hidden" name="content" value="" />
  <input type="hidden" name="langCode" value="" />

  <!--begin::Messenger-->
  <div class="card" id="kt_chat_messenger">

    <!--begin::Card header-->
    <div class="card-header" id="kt_chat_messenger_header">
      <div class="card-title">
        <div class="d-flex justify-content-center flex-column me-3">
          <img alt="Pic" src="/assets/images/common/trans.png" width="50px"/> Google 번역
        </div>
      </div>
      <div class="card-toolbar">
        <div class="d-flex">
          <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
            <input class="btn-check" type="radio" />
            <label class="btn btn-sm btn-light-primary hover-elevate-up" for="trans" onclick="goHref('/play/translate.html')">
              <i class="fa-solid fa-right-left"></i> 번역
            </label>
            <input class="btn-check" type="radio" checked/>
            <label class="btn btn-sm btn-light-primary hover-elevate-up" for="chat" onclick="goHref('')">
              <i class="fa-solid fa-comments"></i> 대화
            </label>
          </div>  
        </div>                    
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body " id="kt_chat_messenger_body">
      <div id="databox" class="scroll-y me-n5 pe-5 h-100px h-lg-auto" data-kt-element="messages" data-kt-scroll="true" 
      data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto" 
      data-kt-scroll-wrappers="#kt_content, #kt_app_content, #kt_chat_messenger_body" data-kt-scroll-offset="5px">

        <div class="d-flex justify-content-start mb-3" id="infoMsg">
          <div class="d-flex flex-column align-items-start pe-5 pt-3">
            <span class="badge badge-circle badge-primary"><i class="fa-solid fa-info text-white"></i></span>
          </div>
          <div class="d-flex flex-column align-items-start">        
            <div class="fw-semibold mw-lg-800px mb-2 p-3 fs-4 bg-light-primary rounded text-gray-900">
            입력된 텍스트를 지정된 대상 언어로 번역합니다.                
            </div>
            <div class="fw-semibold mw-lg-800px mb-2 p-3 fs-4 text-gray-600 ">    
            Translates the entered text into the specified target language.  
            </div>
          </div>      
        </div>

      </div>
    </div>
    <!--end::Card body-->  

    <!--begin::Card footer-->
    <div class="card-footer pt-4" id="kt_chat_messenger_footer">
      <div class="row mb-3">
        <div class="col-6 " id="fromLang"></div>
        <div class="col-1 text-center ">
          <a href="javascript:reverseLang()" class="btn btn-icon btn-light-secondary">
            <i class="fa-solid fa-right-left fs-1"></i>
          </a>                      
        </div>
        <div class="col-5 " id="toLang"></div>                        
      </div>
      <div class="row">
        <div class="col-6 text-end">
          <textarea name="fromText" class="form-control border mb-3" rows="3" data-kt-element="input" 
            placeholder="Type a message" onfocus="initSpeechData()">
          </textarea>
          <audio id="speech-true" controls class="bg-light visually-hidden">                
            <source src="#" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio> 
        </div>
        <div class="col-1 text-center">
          <button type="button" id="loaderBox" onclick="connectTranslate()"  class="btn btn-icon btn-light-secondary" data-kt-element="send" >
            <i class="fa-solid fa-paper-plane fs-1 text-success"></i>
          </button>
        </div>  
        <div class="col-5 text-end">
          <textarea name="toText" class="form-control form-control-flush form-control-solid rounded mb-5" rows="3"></textarea>
          <img alt="Pic" src="/assets/images/google/greyscale-short.png" class="py-5"/>
          <audio id="speech-false" controls class="bg-light visually-hidden">                
            <source src="#" type="audio/mpeg">
            Your browser does not support the audio element.
          </audio>                           
        </div>                                         
      </div>
    </div>
    <!--end::Card footer-->
  </div>
  <!--end::Messenger-->
</form>    
```    

## + 참고

+ [구글 번역 공식문서 바로가기](https://cloud.google.com/translate/docs/setup){: target="_blank" }
+ [구글 클라우드설정 참고글 바로가기](/google/google-run-10/){: target="_blank" }
+ [채팅형 구글 번역 적용 데모서비스 바로가기](https://ondago365.web.app/play/translate-chat.html){: target="_blank" }




