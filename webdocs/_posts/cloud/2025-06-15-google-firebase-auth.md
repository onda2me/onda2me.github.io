---
title: "구글 파이어베이스 Authentication으로 사용자 인증하기"
categories: 
  - google
tags:
  - google
  - api
  - translation
header:
  teaser: /assets/images/post/cloud/firebase-auth-19.png 
---

> **Firebase Authentication**은 모바일 및 웹 애플리케이션에 사용자 인증 기능을 쉽게 추가할 수 있도록 돕는 백엔드 서비스로 
개발자가 직접 사용자 인증시스템을 구축하고 유지보수하는 복잡성을 줄이고, 안전한 인증 기능을 제공한다.
{: .notice--info}

<!-- 
![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/translate02-10.png){: style="width:600px" .image_box}  
-->

## 1. Firebase Authentication의 주요 기능   
    
  + 다양한 인증방법 지원        
    - 이메일/비밀번호    
    - 소셜 로그인   
    - 전화번호 인증   
    - 익명 인증   
    
  + 간편한 통합
    - Android, iOS, Web, C++, Unity 등 다양한 플랫폼 지원
    - 기본 UI 라이브러리 제공    
    - Back 서버 없이 Front에서 인증처리 가능

  + 보안
    - 업계 표준 암호화 및 인증 프로토콜 사용
    - 계정 복구 및 연결과 같은 보안관련 기능 자동 처리
    - 다단계 인증 (MFA) 지원


## 2. Firebase Authentication의 설정 과정

### 1) 프로젝트 생성

  + Firebase Console 접속    
    [Firebase Console 바로가기](https://console.firebase.google.com){: .btn.btn--primary.btn--narrow target="_blank" } 참고    

  + [프로젝트 추가]로 Firebase 프로젝트 생성   
    ![Translate UI ]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-10.png){: style="width:600px" .image_box}  

### 2) 앱등록 및 Firebase SDK 추가

  + Firebase 프로젝트 대시보드에서 프로젝트 선택     
    ![파이어베이스 프로젝트 선택 ]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-19.png){: style="width:600px" .image_box}  

  
  + 앱 유형(iOS, Android, Web) 선택 및 등록    
    ![앱유형 선택 ]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-11.png){: style="width:600px" .image_box}      

    ![앱유형 선택 ]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-12.png){: style="width:600px" .image_box}  

  + Firebase 프로젝트 정보 확인   
    ![파이어베이스 프로젝트 구성정보 ]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-20.png){: style="width:600px" .image_box}    
  
  
  + 앱 구성파일에 Firebase 프로젝트 정보 (프로젝트ID, API키, 인증도메인) 추가    

```js    
// @firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyD9UnrYoT__my-firebase-apiKey__",
  authDomain: "ondago365.firebaseapp.com",
  projectId: "__my-firebase-projectId__",
  storageBucket: "ondago365.appspot.com",
  messagingSenderId: "119661877120",
  appId: "1:119661877120:web:6ff6bf119__my-firebase-appId__",
  measurementId: "G-B__my-firebase-mId__"
};

// Firebase 초기화        
//const app = initializeApp(firebaseConfig); // 9버전 문법
//const database = database(app); // 9버전 문법

const app = firebase.initializeApp(firebaseConfig); // 8버전 문법
const user = firebase.auth();
```

### 3) Authentication 활성화    

  + Firebase > Authentication    

    ![파이어베이스 인증 활성화 ]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-21.png){: style="width:600px" .image_box}    

  + 이메일/비밀번호 선택    

    ![인증]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-22.png){: style="width:600px" .image_box}     

  + 테이스트용 계정 등록 (선택사항)    

    ![인증]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-23.png){: style="width:600px" .image_box}     

### 4) 인증코드 구현

  + 앱코드에서 SDK 초기화    

  ``` html
<!-- Firebase 구성 파일 추가 -->
<script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.6.5/firebase-auth.js"></script>
    
<!-- Firebase Authentication 설정 -->
<script src="/assets/js/firebase-config.js"></script>	
```

  + 사용자 로그인/로그아웃    

``` js            
function goLogin() {
    var email = frm.userEmail.value;
    var password = frm.userPwd.value;
    var loginMessage = document.getElementById('loginMessage');

    loginMessage.classList.add("d-none");     
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {  

            var user = userCredential.user;       
            // Signed in
            console.log("login success!!");
            location.href = "/index.html";
        })
        .catch((error) => {
            let errorObj     = JSON.parse(error.message);
            let errorCode    = errorObj.error.code;
            let errorMessage = errorObj.error.message;

            loginMessage.innerText = "ERROR: " + errorMessage;
            loginMessage.classList.add("text-danger");
            loginMessage.classList.remove("d-none"); 
    });  
} 

function goLogout() {
    alert("logout!!");
    firebase.auth().signOut().then(() => {
        
        //Sign-out successful.
        console.log("logout success!!");
        location.href = "/index.html";

    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;        
        console.error(errorCode +":" + errorMessage);                
    });
} 
```

  + 인증상태 관찰    

``` js
var loginbox = document.getElementById('loginbox');
checkUserSession();

// 로그인 여부 체크
function checkUserSession() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            //console.log('User is signed in.');
            isLogin(user.email, user.uid);
        } else {
            // No user is signed in.
            //console.log('User is signed out.');
            isNotLogin();
        }
    });            
}

// 인증완료
function isLogin(email, uid) {
    loginbox.classList.remove("fa-unlock-keyhole");
    loginbox.classList.add("fa-user-shield");  
}
// 인증전
function isNotLogin() {
    
    loginbox.classList.add("fa-unlock-keyhole");
    loginbox.classList.remove("fa-user-shield");            
}
```
  + 로그인 UI   
    ![인증 UI ]({{ site.baseurl }}/assets/images/post/cloud/firebase-auth-24.png){: style="width:400px" .image_box} 

  + 로그인 페이지 코드    

``` html
<!-- 
 
  // bootstrap을 이용해서 로그인 페이지 디자인 작성
  // 로그인페이지를 별도 작성하지 않으면, 기본 로그인 UI 제공
 -->
<!--begin::Form-->
<form id="frm" class="form w-100" action="#">

  <div class="text-center mb-15">	
    <h1 class="text-gray-900 fw-bolder mb-3 fs-2x">Sign In</h1>
  </div>

  <!-- an error submitting the form d-none -->
  <div id="loginMessage" class=" text-center mb-5 fw-bolder"></div>	

  <div class="fv-row mb-5">
    <!--begin::Email-->
    <input type="text" name="userEmail" placeholder="your-email@example.com"
    data-sb-validations="required,email" autocomplete="off" class="form-control" value=""/>
    <!--end::Email-->
  </div>
  <div class="fv-row mb-5">
    <!--begin::Password-->
    <input type="password" name="userPwd" placeholder="Enter your password here..."  
    autocomplete="off" class="form-control" value=""/>
    <!--end::Password-->
  </div>

  <div class="d-grid mb-5">
    <a href="javascript:goLogin()" class="btn btn-primary">
      <span class="indicator-label">Sign In</span>
      </a>
  </div>
</form>
<!--end::Form-->
```

## + 참고

+ [파이어베이스 공식사이트 바로가기](https://console.firebase.google.com/){: target="_blank" }
+ [파이어베이스 적용 데모서비스 바로가기](https://ondago365.web.app/){: target="_blank" }




