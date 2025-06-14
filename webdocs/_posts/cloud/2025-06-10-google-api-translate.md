---
title: "구글 Cloud Translation을 이용한 언어번역 서비스 개발"
categories: 
  - google
tags:
  - google
  - api
  - translation
header:
  teaser: /assets/images/post/cloud/translate01-00.png 
---

> **구글 번역(Google Translate)** API는 Google Cloud 플랫폼에서 제공하는 서비스 중 하나로, 텍스트를 한 언어에서 다른 언어로 번역하는 기능을 제공한다.
{: .notice--info}

![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/translate01-00.png){: style="width:600px" .image_box}  

## 1. Google 번역 API의 주요 기능
  +  100개 이상의 언어간 텍스트 번역 
  +  입력한 텍스트의 자동으로 언어 감지
  +  정규화된 JSON 응답
  

## 2. 간단한 언어번역 서비스 개발

### 1) Google Cloud Translation API 사용 준비
  + Google Cloud Console에서 프로젝트 생성 (이미 생성되어 있으면 생략)
  + Cloud Translation API 활성화    
    ![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/translate01-20.png){: style="width:600px" .image_box}
  + 서비스 계정 키(JSON) 다운로드 (애플리케이션에서 인증에 사용)  
  [구글 클라우드설정 참고글 바로가기](/google/google-run-10/){: .btn.btn--primary.btn--narrow target="_blank" }

### 2) Java 프로젝트 설정
+ Maven 의존성 추가    

```xml
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>com.google.cloud</groupId>
      <artifactId>libraries-bom</artifactId>
      <version>26.59.0</version>
      <type>pom</type>
      <scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<dependencies>
  <dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-translate</artifactId>
  </dependency>
</dependencies>
```   

+ Java 파일 생성    
      
```java
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;

public class TranslatorExample {

    public static void main(String[] args) {
        Translate translate = TranslateOptions.getDefaultInstance().getService();

        String text = "Hello, world!";
        Translation translation = translate.translate(
            text,
            Translate.TranslateOption.targetLanguage("ko")
        );

        System.out.println("Original: " + text);
        System.out.println("Translated: " + translation.getTranslatedText());
    }
}
```    

+ 실행 결과    
  ![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/translate01-21.png){: style="width:400px" .image_box}
  

## 3. 언어번역 후 음성변환 Java 프로젝트 구축

### 1) 서비스 개요
  + 서비스 목표    
  텍스트로 입력 된 언어를 구글 Cloud Translation API를 사용하여 번역 후 Text To Speech API를 이용하여 음성으로 변환한다.

  + 서비스 구조    
    ![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/translate01-30.png){: style="width:600px" .image_box}
  
  + UI 화면    
  [구글번역 데모사이트 바로가기](https://ondago365.web.app/play/translate.html){: .btn.btn--primary.btn--narrow target="_blank" }    
  ![Text To Speech UI ]({{ site.baseurl }}/assets/images/post/cloud/translate01-00.png){: style="width:600px" .image_box}  

### 2) Java 프로젝트 설정

  + Dto 추가    

```java    
public class GoogleTranslateDto {

  private String fromLang; // 원본 언어 코드 (예: "ko")    
  private String fromText; // 원본 텍스트  
  private String toLang;   // 번역 언어 코드 (예: "en")
  private String toText;   // 번역 텍스트
}
```
  + Controller 추가    

```java  
public class TranslateAPIController {

  private static String PROJECT_ID = "your_projectId";

  @RequestMapping(value="/translate")
  public String translate(GoogleTranslateDto dto) throws Exception {
      
      if(dto.getFromText() == null || dto.getToLang() == null) {
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

## + 참고

+ [구글 번역 공식문서 바로가기](https://cloud.google.com/translate/docs/setup){: target="_blank" }
+ [구글 클라우드설정 참고글 바로가기](/google/google-run-10/){: target="_blank" }
+ [구글 번역 적용 데모사이트 바로가기](https://ondago365.web.app/play/translate.html){: target="_blank" }




