---
title: "Firebase 웹사이트 만들기"
categories: 
  - firebase
tags:
  - firebase
  - google
  - cloud
header:
  teaser: /assets/images/post/cloud/firebase-01-01.png
---

## Google Firebase 

+ **구글 파이어베이스 (Google Firebase)** 는 웹, 안드로이드, 아이폰 앱 개발자를 위한 모바일 앱개발 플랫폼
+ 개발자에게 앱 개발자체에만 집중하도록 호스팅, 인증, 데이타베이스, 설정, 메세징 등의 서비스를 제공
{: .notice--primary}

### Firebase Project

+ 프로젝트 및 제품구성과 관리는 Firebase Console 이나 Firebase CLI 를 통해 할 수 있다.
+ Firebase Console은 제품, 앱, 프로젝트 수준을 설정할 수 있는 관리기능을 웹기반으로 제공한다.
+ Firebase CLI를 설치하면 로컬 앱 디렉토리에서 명령어 입력으로 파이어베이스 호스팅서버에 바로 배포할 수 있다.
+ 구글 계정당 파이어베이스 프로젝트는 Spark 요금제의 경우 계정당 5~10개로 제한된다.


### Firebase Hosting
+ HTML, CSS, 자바스크립트, 미디어 파일 등 정적 애셋과 파이썬 등 동적 컨텐츠도 호스팅 할 수 있다.

## Google Cloud?
> 구글 인프라(컴퓨팅, 스토리지, 네트워킹, 데이터분석, 머신러닝)를 서비스 형태로 제공하여 웹사이트나 앱을 개발할 때 이러한 서비스를 조합하여 인프라를 구성하고, 코드의 빌드과정을 거쳐 고객에게 서비스를 제공할 수 있도록 구글에서 제공하는 클라우드 컴퓨팅 서비스 제품
{: .notice--primary}

### Google Cloud 활용
+ 구글 클라우드는 인프라 구성, 데이터 분석, 머신러닝을 활용한 소프트웨어 빌드에 활용
+ 백앤드 및 서버 개발자가 사용
+ 프로젝트 및 리소스는 Google Cloud Console 이나  Google Cloud CLI를 통해 관리 
+ 서비스에 따라 무료/조건형무료/유료형으로 구분


## 파이어베이스와 구글 클라우드 간의 관계
> 파이어베이스는 구글 클라우드 서비스 중에서 앱개발자가 주로 사용하는 서비스의 묶음으로 생각하면 된다.
> 즉, 파이어베이스 프로젝트는 구글 클라우드 프로젝트이다.
{: .notice--primary}

![구글 클라우드 프로젝트]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-01.png){: style="width:700px" .image_box}

## Firebase Project 만들기

### @ 사전 준비작업
1. node.js 설치    

    node.js는 npm 명령어 사용을 위한 것으로 이미 설치되어 있으면 다음 단계로 진행한다 [node 관련글 바로가기](/vue/node-npm){: .btn.btn--primary.btn--narrow target="_blank" }

2. firebase 설치    
    ```
    $npm install firebase
    ```

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-02.png){: style="width:800px" .image_box}

3. firebase CLI 설치    

    ```
    $npm install -g firebase-tools
    ```

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-021.png){: style="width:800px" .image_box}
    
4. firebase 인증 및 google 계정 연결   

    ```
    $firebase login
    ```
    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-022.png){: style="width:800px" .image_box}

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-023.png){: style="width:500px" .image_box}
    

### @ Firebase Project 생성

1. 파이어베이스 콘솔에서 프로젝트 추가    

    [파이어베이스 콘솔 접속: https://console.firebase.google.com](https://console.firebase.google.com/?hl=ko){: .btn.btn--primary.btn--narrow target="_blank" }

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-21.png){: style="width:800px" .image_box}

2. 로컬 PC에 프로젝트 폴더 생성  

    ```
    $mkdir firebase-agency
    ```

3. 생성한 폴더를 파이어베이스 프로젝트로 초기화 설정   
    + 호스팅 사용여부 등을 설정한다.

    ```
    $firebase init
    ```

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-03.png){: style="width:800px" .image_box}

4. 파이어베이스 프로젝트 목록을 확인
    + 파이어베이스 프로젝트를 정상적으로 생성했는지 확인한다.    

    ```
    $firebase projects:list         # 파이어베이스 프로젝트 목록
    ```

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-031.png){: style="width:800px" .image_box}

5. 로컬 개발서버 실행    

    ```
    $firebase emulators:start
    $firebase serve                 # serve 명령어로 서버 실행은 권장하지 않음
    ```

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-04.png){: style="width:800px" .image_box}    

6. 로컬 개발서버 접속    

    > [http://localhost:5000/](http://localhost:5000/)

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-05.png){: style="width:500px" .image_box}

7. 샘플페이지 작성    

    ```html
    @hello.html
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Welcome to Firebase Hosting</title>
        </head>
    <body>
        <div id="message">
        <h2>Welcome !! Hello !!</h2>
        <h1>Firebase My First App Complete</h1>
        </div>
    </body>
    </html>
    ```


8. 샘플페이지 확인    
    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-051.png){: style="width:700px" .image_box}


7. 파이어베이스 호스팅 서버에 배포 및 서비스 확인    

    > 프로젝트의 루트 디렉토리에서 명령어 실행

    ```
    $firebase deploy                        # 파이어베이트 프로젝트 파일 모두 배포    
    $firebase deploy --only hosting         # 호스팅 콘텐츠 및 구성만 배포
    ```

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-052.png){: style="width:700px" .image_box}
    

## 참고

+ **https://firebase.google.com/**  [파이어베이스 호스팅 문서](https://firebase.google.com/docs/hosting/quickstart?hl=ko){: .btn.btn--primary.btn--narrow target="_blank" }
+ [Onda2Me 파이어베이스 데모 사이트](https://api-project-209152001727.web.app/){: .btn.btn--primary.btn--narrow target="_blank" }

    ![firebase init]({{ site.baseurl }}/assets/images/post/cloud/firebase-01-06.png){: style="width:700px" .image_box}



