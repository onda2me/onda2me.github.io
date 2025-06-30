---
title: "Google Gemini를 활용한 명령 프롬프트형 AI 프로젝트 "
categories: 
  - google
tags:
  - google
  - ai
  - gemini
header:
  teaser: /assets/images/post/cloud/gemini-text-01.png 
---

## 1. Vertex AI와 Gemini 

> **Vertex AI**는 Google Cloud에서 제공하는 통합 머신러닝 플랫폼으로, AI 모델의 개발, 학습, 배포, 관리까지 전체 워크플로우를 한 번에 처리할 수 있게 도와주는 서비스로 생성형 AI 애플리케이션을 빌드하고 배포하기 위한 기능 및 서비스를 제공한다.        
**Gemini**는 Vertex AI에서 사용할 수 있는 특정 AI 모델로 개발자는 Gemini API를 호출하여 Gemini의 기능을 애플리케이션에 통합할 수 있다.
{: .notice--info}

### 1) Vertex AI의 장점
+ 학습 인프라를 자동으로 관리
+ REST API로 쉽게 서비스 연동 가능
+ AutoML로 모델 생성이 빠르고 간단
+ 모델 버전 관리, 모니터링, 실험 추적 등 MLOps 기능 내장
+ Jupyter 기반 Vertex AI Workbench 제공하여 개발이 편리

<!-- 
## 2. Vertex AI의 워크플로    

#### 1) 데이터 준비 (GCS, BigQuery 등)    
   ↓    
#### 2) 모델 학습 (AutoML or 커스텀)
   ↓    
#### 4) 모델 배포 (Endpoint 생성)
   ↓    
#### 5) 예측 API 호출 (Java, Python, REST 등에서 호출)
-->
    
        

### 2) Gemini 모델 비교


| 특징	 |  Gemini Pro	 |  Gemini Flash  |     
| :---- | :---- |  :---- |     
| 목표 | 	다양한 범위의 작업에 대한 균형 잡힌 성능과 기능  | 	속도와 효율성 극대화, 저비용 대량 처리  |     
| 성능 | 강력하고 다목적, 복잡한 추론 능력	 | 매우 빠름, 가벼운 작업에 최적화, 응답 지연 최소화  |     
| 비용 | 	Gemini Flash보다 높음	 | Gemini Pro보다 낮음  |     
| 주요 |  사용처	일반적인 웹/모바일 앱, 챗봇 백엔드, 상세 콘텐츠 생성 | 	실시간 챗봇, 스트리밍 분석, 대량 콘텐츠 모더레이션, 빠른 초안  |     
| 멀티모달	 | 지원 (Gemini Pro Vision)	 | 지원   |     
    
        



## 2. Gemini API를 활용한 명령 프롬프트형 AI 프로젝트

### 1) 서비스 개요

#### 1. 목표
  질문을 입력하면, Gemini API를 이용하여 결과를 받아 사용자에게 표시한다.

#### 2. 사용 기술
+ AI : Google Vertex AI> Gemini Flash 2.5
+ UI : HTML + REST API + Firebase
+ Backend : Java Springboot + Google Cloud Run
+ 인증 : GCP 서비스 계정

#### 3. 서비스 구성     

![Google Vision UI ]({{ site.baseurl }}/assets/images/post/cloud/gemini-text-11.png){: style="width:600px" .image_box} 

#### 4. 서비스 UI    

![Google Vision UI ]({{ site.baseurl }}/assets/images/post/cloud/gemini-text-01.png){: style="width:600px" .image_box}    

### 2) 프로젝트 설정

#### 1. 구글 프로젝트 설정   

+ [구글 프로젝트 설정 바로가기]( https://console.cloud.google.com/projectselector2/home/dashboard){: .btn.btn--primary.btn--narrow target="_blank" } 

  ![구글 프로젝트 설정 ]({{ site.baseurl }}/assets/images/post/cloud/gemini-text-21.png){: style="width:600px" .image_box}  

#### 2. Vertex AI API 사용설정    

+ [Vertex AI API 사용설정 바로가기](https://console.cloud.google.com/apis/library){: .btn.btn--primary.btn--narrow target="_blank" } 
  
  ![Vertex AI API 사용설정 ]({{ site.baseurl }}/assets/images/post/cloud/gemini-text-22.png){: style="width:600px" .image_box} 

#### 3. Vertex AI IAM 역할 부여    

+ [IAM 역할 부여 바로가기](https://console.cloud.google.com/iam-admin/iam){: .btn.btn--primary.btn--narrow target="_blank" } 

  ![Vertex AI IAM 역할 부여 ]({{ site.baseurl }}/assets/images/post/cloud/gemini-text-23.png){: style="width:600px" .image_box} 

#### 4. API Key 생성   

+ [API Key 생성 바로가기](https://aistudio.google.com/app/apikey){: .btn.btn--primary.btn--narrow target="_blank" } 

  ![API Key 생성 ]({{ site.baseurl }}/assets/images/post/cloud/gemini-text-24.png){: style="width:600px" .image_box} 


#### 5. Java 프로젝트 설정   

+ @pom.xml 수정    

```xml
<dependencies>
  <dependency>
    <groupId>com.google.genai</groupId>
    <artifactId>google-genai</artifactId>
    <version>0.7.0</version>
  </dependency>
</dependencies>
```

#### 6. Gemini API에 프롬프트 전송할 Service Class 작성

```java
@Getter
@Setter
@Service
public class GoogleGeminiAIService {
    
    private static String API_KEY = "MY_GEMINI_API_KEY";
    private static String MODEL_ID = "gemini-2.5-flash";   // 원하는 모델 설정    
    private Client client;
    
    // 서비스 초기화 시 Client를 생성합니다.
    public GoogleGeminiAIService() throws IOException {
        
        GoogleCredentials credentials = 
                    GoogleCredentials.getApplicationDefault();
        
        client = Client.builder()
                .credentials(credentials)
                .apiKey(API_KEY)
                .httpOptions(HttpOptions.builder().apiVersion("v1").build())
                .build();
    }
    
    public static void main(String[] args) throws IOException {
        
        GoogleGeminiAIService service = new GoogleGeminiAIService();        
        service.generateTextFromText("Explain how AI works in a few words");      
      }

    public String generateTextFromText(String text) throws IOException {
        
        GenerateContentResponse response =
            client.models.generateContent(MODEL_ID, text, null);

        return response.text();
    }  
}
```

#### 7. Controller class 작성
```java
@RestController
@RequestMapping("/api/gemini")
public class GoogleGeminiController {

    @Autowired
    private GoogleGeminiAIService geminiService;
    
    @RequestMapping("/text")
    public GoogleGeminiDto textPrompt(@RequestParam String prompt) throws Exception {
        
        GoogleGeminiDto dto = new GoogleGeminiDto(geminiService.generateTextFromText(prompt));        

        return dto;
    }
}
```

#### 8. @gemini-text.html (UI) 작성
```html
<!-- @gemini-text.html -->
<form id="frm" name="frm"  action="#">
  <!--begin::Chat-->
  <div class="card card-px-0 px-5 " id="kt_chat_messenger">

    <!--begin::Card body-->
    <div class="card-body " id="kt_chat_messenger_body">
      <!-- 결과 출력 -->
      <div id="databox" class="scroll-y me-n5 pe-5 h-350px h-lg-auto"></div>
    </div>
    <!--end::Card body-->                
    <!--begin::Card footer-->
    <div class="card-footer pt-4" id="kt_chat_messenger_footer">
      <div class="row justify-content-center">
        <div class="col-10 pe-2">
          <div class="input-group">                          
            <textarea name="prompt" class="form-control" aria-label="With textarea" rows="2" 
                placeholder="Ask Gemini" onkeydown="if(event.keyCode == 13){ connectGemini(); return false;}"></textarea>
            <span id="loaderBox" class="input-group-text" onclick="connectGemini()">
              <i class="fa-solid fa-paper-plane fs-1 text-success"></i>
            </span>
          </div>

        </div>                                         
      </div>
    </div>
    <!--end::Card footer-->
  </div>
  <!--end::Chat-->
</form>

<script> 
    function connectGemini() {  
      var frmdata = $("#frm").serialize();

      if(frm.prompt.value == "") {
        alert("질문을 입력하세요!!");
        return false;
      }
       
      ajaxCallApi(SERVER_URL + "/api/gemini/text", frmdata, successGemini);
    } 
</script>  
```
      
#### 9. 서비스 화면

+ [Gemini AI 서비스 바로가기](https://ondago365.web.app/play/google/gemini-text.html){: .btn.btn--primary.btn--narrow target="_blank" } 

  ![UI 동작화면 ]({{ site.baseurl }}/assets/images/post/cloud/gemini-text-31.gif){: style="width:600px" .image_box} 

## + 참고

+ [구글 Gemini 공식문서 바로가기](https://ai.google.dev/gemini-api/docs){: target="_blank" }
+ [구글 Gemini AI 적용 데모사이트 바로가기](https://ondago365.web.app/play/google/gemini-text.html){: target="_blank" }




