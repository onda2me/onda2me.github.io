---
title: "Onda2Me Front(Firebase) + Back(Cloud Run) 통합 웹서비스 구축"
categories: 
  - google
tags:
  - google
  - firebase
  - cloudrun
header:
  teaser: /assets/images/post/cloud/complex-01.png
toc: true
toc_label: "Onda2Me Firebase + Cloud Run 통합 웹서비스"
toc_icon: "list"  
---

## 1. 구글 클라우드?  

> **구글 클라우드(Google Cloud)** 는 구글 인프라(컴퓨팅, 스토리지, 네트워킹, 데이터분석, 머신러닝)를 서비스 형태로 제공하여 웹사이트나 앱을 개발할 때 서비스를 조합하여 인프라를 구성하고, 코드의 빌드과정을 거쳐 고객에게 서비스를 제공할 수 있도록 개발자에게 구글에서 제공하는 클라우드 컴퓨팅 서비스 제품으로 웹/앱 애플리케이션을 기획할 때 별도의 서버 구축없이 무료 또는 유료로 구글 클라우드 서비스를 조합하여 인프라 구성이 가능하다.
{: .notice--info}

## 2. Python 및 JavaScript가 포함된 동적 웹 애플리케이션 예시
  [출처: https://console.cloud.google.com/products/solutions/details/dynamic-web-app](https://console.cloud.google.com/products/solutions/details/dynamic-web-app){: .btn.btn--primary.btn--narrow target="_blank" }  

### 1. 솔루션 조합 제품    
  
  ![python + javascript 솔루션 구성도 ]({{ site.baseurl }}/assets/images/post/cloud/complex-03.png){: style="width:600px" .image_box}

### 2. 솔루션 구성도    
  
  ![python + javascript 솔루션 구성도 ]({{ site.baseurl }}/assets/images/post/cloud/complex-02.png){: style="width:600px" .image_box}

### 3. 솔루션 요약
  1. 웹 클라이언트는 Firebase 호스팅에서 호스팅됩니다.
  2. 웹 클라이언트는 Cloud Run 서비스로 실행되고 Python으로 작성된 API 백엔드를 호출합니다.
  3. Python 애플리케이션의 구성 및 기타 보안 비밀이 Cloud Secrets Manager에 저장됩니다.
  4. PostgreSQL용 CloudSQL은 Python 애플리케이션의 관계형 데이터베이스 백엔드로 사용됩니다.
  5. 애플리케이션의 정적 애셋과 컨테이너 이미지는 Cloud Storage에 저장됩니다.

> Google Cloud Run은 아래 그림과 같이 Springboot 동적 웹서비스도 가능하지만, Cloud Run은 빌드 -> 배포의 과정이 번거롭고, 페이지 호출 시 CPU 사용량에 따라 요금이 부과되는 유료 서비스이기에 요금 절약을 위해 Onda2Me 서비스를 Front (= Firebase)와 Back (= Cloud Run) 기능을 분리하여 재구성하였다.
{: .notice--info}

+ Cloud Run Springboot 웹서비스 (Front + Back)
  ![python + javascript 솔루션 구성도 ]({{ site.baseurl }}/assets/images/post/cloud/complex-04.png){: style="width:600px" .image_box}

## 3. Firebase + Cloud Run 통합 웹서비스

### 1. Onda2Me 프로젝트 구성

+ Google Cloud Service + Web API 구성    
 
  + BackEnd 	: Google Cloud Run + Firestore
  + FrontEnd 	: Google Firebase
  + Web API	: 기상청 API 허브, 공공 데이터, Riot Games API 등 활용    
&nbsp;    

+ Onda2Me 프로젝트 구성도    
  ![Front(Firebase) + Back(Cloud Run Springboot) 솔루션 구성도 ]({{ site.baseurl }}/assets/images/post/cloud/complex-05.png){: style="width:600px" .image_box}

+ Onda2Me 메인페이지 구성도    
  ![Front(Firebase) + Back(Cloud Run Springboot) 솔루션 구성도 ]({{ site.baseurl }}/assets/images/post/cloud/complex-051.png){: style="width:600px" .image_box}

### 2. Onda2Me 구글지도 연동 서비스
+ 구글지도 연동 구성도    
  ![Google Place 구성도]({{ site.baseurl }}/assets/images/post/cloud/complex-06.png){: style="width:600px" .image_box}


+ 구글지도 연동 FrontEnd (Firebase)    
  ![Google Place 구성도]({{ site.baseurl }}/assets/images/post/cloud/complex-07.png){: style="width:600px" .image_box}

+ 구글지도 연동 BackEnd API (Cloud Run)    
  ![Google Place 구성도]({{ site.baseurl }}/assets/images/post/cloud/complex-08.png){: style="width:600px" .image_box}




## + 참고

### 1. Firebase 서비스 구성법

+ 구글 파이어베이스 웹사이트 만들기[바로가기](/firebase/google-firebase-01/){: .btn.btn--primary.btn--narrow target="_blank" }
+ 구글 파이어베이스 웹사이트에 부트스트랩 적용하기[바로가기](/firebase/google-firebase-02/){: .btn.btn--primary.btn--narrow target="_blank" }

### 2. Cloud Run 서비스 구성법

+ 구글 클라우드런 환경설정 [바로가기](/google/google-run-10/){: .btn.btn--primary.btn--narrow target="_blank" }
+ 구글 클라우드런 Springboot 프로젝트설정 [바로가기](/google/google-run-20/){: .btn.btn--primary.btn--narrow target="_blank" }

### 3. Cloud Run 빌드 및 배포 배치파일
 
> + gbuild.bat 실행방법    
{: .notice--primary}

```bat
rem ----------------------------
rem @gbuild.bat
rem google cloud build window batch 파일
rem gcloud builds submit --tag gcr.io/project-name/service-name:tag-name
rem ----------------------------

IF ["%1"]==[""] (
  echo NO Tag : 15.map
  GOTO:EOF
) else (
  gcloud builds submit --tag gcr.io/onda2me/service-name:%1
)
GOTO:EOF
```
  ![google builds]({{ site.baseurl }}/assets/images/post/cloud/complex-09.png){: style="width:800px" .image_box}

> + gdeploy.bat 실행방법        
{: .notice--primary}    

```bat
rem ----------------------------
rem @gdeploy.bat
rem google cloud deploy window batch 파일
rem gcloud run deploy onda2me --tag gcr.io/project-name/service-name:tag-name
rem ----------------------------

IF ["%1"]==[""] (
  echo NO Tag : 15.map
  GOTO:EOF
) else (
  gcloud run deploy onda2me --image gcr.io/onda2me/service-name:%1
)
GOTO:EOF
```

```bat
gdeploy.bat 15.map
```



