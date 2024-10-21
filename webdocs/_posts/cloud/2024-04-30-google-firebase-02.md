---
title: "Firebase 웹사이트에 Bootstrap 적용하기"
categories: 
  - firebase
tags:
  - firebase
  - google
  - cloud
header:
  teaser: /assets/images/post/cloud/firebase-01-06.png
---

## Bootstrap 

+ **구글 파이어베이스 (Google Firebase)** 는 구글의 웹, 안드로이드, 아이폰 앱 개발자를 위한 모바일 앱개발 플랫폼
+ 개발자에게 앱 개발자체에만 집중하도록 호스팅, 인증, 데이타베이스, 설정, 메세징 등의 서비스를 제공
{: .notice--primary}

### 1. bootstap 테마 다운로드


+ **https://startbootstrap.com/**  [바로가기](https://startbootstrap.com/){: .btn.btn--primary.btn--narrow target="_blank" }

    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-10.png){: style="width:700px" .image_box}


### 2. 프로젝트 폴더에 압축 풀기

+ 로컬PC 파이어베이스 프로젝트 폴더에 압축을 푼다

    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-20.png){: style="width:700px" .image_box}

### 3. 파이어베이스 서버로 배포

+ 프로젝트 리소스 및 구성 배포    

    ```
    $firebase deploy                        # 설정정보 등 관련파일 모두 배포    
    $firebase deploy --only hosting         # 호스팅 콘텐츠 및 구성만 배포
    ```

### 4. 파이어베이스 서버 적용 확인    

+ 파이어베이스 콘솔 또는 프로젝트 사이트로 접속하여 변경사항 적용을 확인한다.
+ **https://console.firebase.google.com**  [파이어베이스 콘솔 바로가기](https://console.firebase.google.com/?hl=ko){: .btn.btn--primary.btn--narrow target="_blank" }

    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-30.png){: style="width:700px" .image_box}


### 5. 원하는 문구나 디자인으로 변경    

+ index.html / css 파일을 수정한다.  
+ [디자인적용 데모 바로가기](https://api-project-209152001727.web.app){: .btn.btn--primary.btn--narrow target="_blank" }  
 
    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-40.png){: style="width:700px" .image_box}


## 참고
+ **https://learn-and-give.tistory.com/18**  [바로가기](https://learn-and-give.tistory.com/18){: .btn.btn--primary.btn--narrow target="_blank" }
+ **https://firebase.google.com/docs/hosting/quickstart?hl=ko**  [바로가기](https://firebase.google.com/docs/hosting/quickstart?hl=ko){: .btn.btn--primary.btn--narrow target="_blank" }    
