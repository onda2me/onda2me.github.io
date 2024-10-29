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

+ **부트스트랩 (Bootstrap)**은 트위터에서 시작된 오픈소스 프론트엔드 프레임워크
+ 각종 레이아웃, 버튼, 입력창 등의 디자인과 기능을 css와 javascript로 만들어 놓은 프론트엔드 툴킷
+ PC, 모바일용 디자인을 반응형으로 지원하여 디자인 소요시간 단축
+ 오픈소스로 재배포에 자유로우며, 무료 템플릿도 많아 간단한 웹서비스 개발에 용이
{: .notice--primary}

### 1. bootstap 테마 다운로드


+ 테마 제공 사이트1 **https://startbootstrap.com**  [바로가기](https://startbootstrap.com){: .btn.btn--primary.btn--narrow target="_blank" }에 접속하여 원하는 테마를 다운로드 한다.
+ 테마 제공 사이트2 **https://getbootstrap.com**  [바로가기](https://getbootstrap.com){: .btn.btn--primary.btn--narrow target="_blank" }

    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-10.png){: style="width:700px" .image_box}


### 2. 프로젝트 폴더에 압축 풀기

+ 로컬PC 파이어베이스 프로젝트의 웹서비스 폴더에 압축을 푼다

    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-20.png){: style="width:700px" .image_box}

### 3. 파이어베이스 서버로 배포

+ 파이어베이스 서버로 프로젝트 리소스 및 구성을 배포한다.    
+ 파이어베이스 프로젝트 설정은 이전글을 [파이어베이스 프로젝트 만들기](/firebase/google-firebase-01/){: .btn.btn--primary.btn--narrow target="_blank" } 참고한다.

    ```
    $firebase deploy                        # 설정정보 등 관련파일 모두 배포    
    $firebase deploy --only hosting         # 호스팅 콘텐츠 및 구성만 배포
    ```

### 4. 파이어베이스 서버 적용 확인    

+ 파이어베이스 콘솔 또는 프로젝트 사이트로 접속하여 변경사항 적용을 확인한다.
+ **https://console.firebase.google.com**  [파이어베이스 콘솔 바로가기](https://console.firebase.google.com/?hl=ko){: .btn.btn--primary.btn--narrow target="_blank" }

    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-30.png){: style="width:700px" .image_box}


### 5. 원하는 문구나 디자인으로 변경    

+ index.html 및 css 파일을 수정하여 원하는 디자인 변경한다.
+ 디자인 변경은 [Onda2Me 파이어베이스 데모 사이트: https://api-project-209152001727.web.app/](https://api-project-209152001727.web.app){: .btn.btn--primary.btn--narrow target="_blank" } 를 참고한다.
 
    ![bootstrap]({{ site.baseurl }}/assets/images/post/cloud/firebase-20-40.png){: style="width:700px" .image_box}


## 참고
+ **티스토리 참고글**  [바로가기](https://learn-and-give.tistory.com/18){: .btn.btn--primary.btn--narrow target="_blank" }
+ **https://firebase.google.com/**  [바로가기](https://firebase.google.com/docs/hosting/quickstart?hl=ko){: .btn.btn--primary.btn--narrow target="_blank" }    
