---
title: "구글 클라우드 Vision API를 이용한 이미지분석 서비스 구축"
categories: 
  - google
tags:
  - google
  - api
  - translation
header:
  teaser: /assets/images/post/cloud/vision-api-01.png 
---

> **컴퓨터 비전(Computer Vision)**은 컴퓨터가 인간의 시각 시스템처럼 디지털 이미지나 비디오 등 시각적 데이터를 인식하고 처리하며, 그로부터 의미 있는 정보를 추출하고 이해하는 인공지능(AI)의 한 분야로 **기계에 '보는 능력'을 부여하고, 본 것을 '이해**'하게 만드는 기술이다.    
**구글 클라우드 비전(Google Cloud Vision)**는 GCP(Google Cloud Platform)에서 제공하는 **사전 학습된 머신러닝 클라우드 서비스**로 개발자가 복잡한 컴퓨터 비전 기술을 직접 구현하지 않고도 애플리케이션에 쉽게 통합할 수 있도록 제공하는 서비스이다.
{: .notice--info}


![Google Vision UI ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-01.png){: style="width:600px" .image_box} 

## 1. 컴퓨터 비전의 작동 과정
#### 1) 이미지 수집 (Image Acquisition)    
  카메라, 센서 등을 통해 사진, 비디오와 같은 시각적 데이터를 수집    

#### 2) 이미지 처리  (Image Processing)    
  딥러닝, 머신러닝 알고리즘을 사용하여 수집된 이미지 데이터를 분석    

#### 3) 이미지 이해 및 분석 (Image Interpretation and Analysis)    
  처리된 데이터를 바탕으로 컴퓨터는 객체를 식별하고, 분류하며, 움직임을 추적하는 등 최종적인 판단    



## 2. 구글 클라우드 비전    

|  서비스 |  설명 |    
| :---- | :---- |    
|  Cloud Vision API  |  이미지 라벨 지정,  얼굴 및 랜드마크 감지, OCR, 세이프서치, 월 1000회 무료  |    
|  Document AI  |  스캔한 문서 및 이미지에서 유용한 정보를 추출하고 문서 워크플로를 자동화  |    
|  Vertex AI Vision  |  데이터 준비 도구, 모델 학습 및 배포, 솔루션 제어  |    
|  Gemini Pro Vision  |  정보 탐색, 객체 인식, 디지털 콘텐츠 이해, 구조화된 콘텐츠 생성, 자막 생성/설명 |    

## 3. 구글 클라우드 비전 API 주요기능

#### 1) 텍스트 감지    

+ 이미지에서 텍스트, 경계 상자, textAnnotations로 식별된 단어 목록과 계층 구조를 반환    

![google vision ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-11.png){: style="width:400px" .image_box}  

#### 2) 랜드마크 인식 (Landmark Detection)

+ 이미지에서 유명한 랜드마크 (건물, 자연경관 등) 이름, 신뢰도 점수, 경계 상자, 좌표 제공

![google vision ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-12.png){: style="width:400px" .image_box}  

#### 3) 라벨 인식    
+ 이미지의 전반적인 내용과 관련된 객체, 활동, 장소 등을 식별하여 라벨을 제공 (예: "강아지", "야외", "놀이")
+ 각 라벨에 대해 텍스트 설명, 신뢰도 점수, 적합성 평점을 반환    

![google vision ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-13.png){: style="width:400px" .image_box}  

#### 4) 얼굴 감지 (Face Detection)     

  + 이미지에서 얼굴을 감지하고, 얼굴 표정(행복, 슬픔 등), 머리 방향, 눈 위치 등 다양한 얼굴 속성을 파악

#### 5) 로고 감지 (Logo Detection)     
  + 이미지에서 브랜드 로고를 식별

#### 6) 안전 검색 감지 (SafeSearch Detection)         
  + 이미지에 성인, 폭력, 의료, 조잡한 콘텐츠 등 민감하거나 부적절한 콘텐츠가 포함되어 있는지 여부를 판단

#### 7) 이미지 속성 감지 (Image Properties Detection)           
  + 이미지의 지배적인 색상, 밝기 등 시각적 특성을 분석     

#### 8) 객체 감지 (Object Localization)        
  + 이미지의 여러 객체를 식별하고, 각 객체의 위치를 바운딩 박스로 표시    

#### 9) 웹 감지 (Web Detection)         
  + 이미지와 관련된 웹 페이지, 일치하는 이미지, 유사한 이미지 등을 검색    

#### 10) 크롭 힌트 (Crop Hints)         
  + 이미지의 주요 콘텐츠를 포함하는 최적의 자르기 영역을 제안

## 4. Java를 이용한 이미지 분석 프로젝트
#### 1) Google Cloud 프로젝트 설정 및 API 활성화    

  + [구글 클라우드 콘솔 접속](https://console.cloud.google.com/){: .btn.btn--primary.btn--narrow target="_blank" } 해서 Vision API 검색    

  + Cloud Vision API 활성화    
  ![google vision ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-141.png){: style="width:600px" .image_box}  

  + Cloud Vision API 활성화 결과 (월 1000회까지 무료)    
  ![google vision ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-15.png){: style="width:600px" .image_box}    

#### 2) 서비스계정 생성 등 인증 설정 

  + Vision API 사용자 역할 부여

#### 3) Maven 종속성 추가
```xml
<!-- @pom.xml -->
 <dependencies>
  <dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-vision</artifactId>    
  </dependency> 
  </dependencies>  

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
```

#### 4) Java 코드 작성 및 API 호출

```java
// @GoogleVisionMain.java
public class GoogleVisionMain {
  /**
   * 개요:  https://cloud.google.com/vision?hl=ko
   * 가이드 문서: https://cloud.google.com/vision/docs/features-list?hl=ko
   */
  public static void main(String[] args) {        
      visionLocalImage("sample-1.jpg"); // 분석할 이미지 파일        
  }

  public static void visionLocalImage(String fileName) throws IOException {
    InputStream inputStream   = null;
    OutputStream outputStream = null;
    String outputFile = "out-"+fileName;
    
    try {
        ByteString imgBytes = ByteString.readFrom(new FileInputStream(LOCAL_PATH+fileName));
        Image img = Image.newBuilder().setContent(imgBytes).build();
              
        //--------------------------------------------------------------------
        // Input/Output Image
        //--------------------------------------------------------------------
        inputStream = new FileInputStream(LOCAL_PATH+fileName);
        outputStream = new FileOutputStream(LOCAL_PATH+outputFile);  

        detectTexts(img, inputStream, outputStream);    
    } finally {
        if(inputStream != null) inputStream.close(); 
        if(outputStream != null) outputStream.close(); 
    } 
  }

  public static void detectTexts(Image img, InputStream is, OutputStream os) throws IOException {
              
      List<AnnotateImageRequest> requests = new ArrayList<>();
      List<String> list = new ArrayList<String>();
      ImageAnnotatorClient client = null;
            
      Feature feat = Feature.newBuilder().setType(Feature.Type.TEXT_DETECTION).build();
      AnnotateImageRequest request =
          AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();
      requests.add(request);

      try {
          
        client = ImageAnnotatorClient.create();
        BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
        List<AnnotateImageResponse> responses = response.getResponsesList();
        
        for (AnnotateImageResponse res : responses) {
          if (res.hasError()) {
            System.out.format("Error: %s%n", res.getError().getMessage());
            return null;
          }

          List <EntityAnnotation> annotations = res.getTextAnnotationsList();   

          for (EntityAnnotation annotation : annotations) {
            System.out.format("Text: %s%n", annotation.getDescription());
            list.add(annotation.getDescription());
          }
        }
      } finally {
          if(client != null) client.close();
      }      
  }
}      
```
#### 5) Vision 적용 UI        

> 분석전 화면     

[Java + Vision 적용 데모 바로가기](https://ondago365.web.app/play/vision-api.html){: .btn.btn--primary.btn--narrow target="_blank" }    

![google vision ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-21.png){: style="width:600px" .image_box}  

> 분석결과 화면    

![google vision ]({{ site.baseurl }}/assets/images/post/cloud/vision-api-22.png){: style="width:600px" .image_box}  


## + 참고

+ [구글 클라우드 비전 공식사이트 바로가기](https://cloud.google.com/vision?hl=ko){: target="_blank" }
+ [구글 클라우드 비전 가이드문서 바로가기](https://cloud.google.com/vision/docs/features-list?hl=ko){: target="_blank" }
+ [구글 클라우드 비전 적용 데모사이트 바로가기](https://ondago365.web.app/play/vision-api.html){: target="_blank" }




