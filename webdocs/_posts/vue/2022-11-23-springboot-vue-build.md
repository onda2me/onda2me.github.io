---
title: "SpringBoot BackEnd + Vue FrontEnd Step2. Build 설정"
classes: single 
toc_label: "SpringBoot + Vue"
toc: true
toc_sticky: true
toc_icon: "list"
sidebar:
  nav: "docs_vue"
categories: 
  - vue
tags:
  - vue
  - springboot
---

> 스프링부트 웹서버는 8007, Vue 웹서버는 8080 포트로 서비스 하도록 설정    

> 1. 스프링부트 프로젝트 생성 (이전글)     
2. 스프링부트 프로젝트에 Vue 프로젝트 생성(이전글)    
3. Vue 빌드 시 스프링부트의 리소스 폴더로 build 경로 설정    
4. 스프링부트 서버에서 Vue 웹서비스 동작 확인
{: .notice--info}

### 1. Vue 웹서비스 포트 설정
> srcvue > package.json 수정        

```
	  "scripts": {
	    "serve": "vue-cli-service serve --port 8080",  //  --port 8080 추가
	    "build": "vue-cli-service build",
	    "lint": "vue-cli-service lint"
  },
```

### 2. Vue build 설정
> srcvue > vue.config.js 수정        

```
module.exports = defineConfig({
  transpileDependencies: true,
  // output 디렉토리 설정 추가
  outputDir: "../src/main/resources/static/front/",   
  publicPath: "/front/",
  devServer: {          // SpringBoot 내장 WAS의 포트와 주소 설정 
    port: 8007,         // SpringBoot WAS의 포트
    proxy: "http://localhost:8080"              
  } 
})
```

### 3. Vue build 실행 
> srcvue > npm run build    

![]({{ site.baseurl }}/assets/images/post/vue/boot_build0.png){: style="width:600px" .image_box}    

### 4. Vue build 결과    
> /src/main/resources/static/front/ 경로에 vue 파일 생성

![]({{ site.baseurl }}/assets/images/post/vue/boot_build1.png){: style="width:200px" .image_box}    

> **Vue.js**는 **Single Page Application** 으로 웹서비스 루트에 **index.html**이 존재해야 한다.    
따라서 build로 생성 된 **[resources > static > front > index.html]** 파일을     
프로젝트 웹서비스 루트인 **[resources > static > index.html]** 에 복사해 준다.     
(* index.html은 변경되는 파일이 아니므로 최초 1회만 복사해 주면 된다.)
{: .notice--info}

### 5. Vue 웹서비스 접속
> [http://localhost:8080/](http://localhost:8080/)    

> http://localhost:8080/ 로 접속하면 http://localhost:8080/`front/`에서 서비스 된다.
{: .notice--info}

![]({{ site.baseurl }}/assets/images/post/vue/boot_build3.png){: style="width:600px" .image_box}

### 6. SpringBoot 웹서비스 접속
> [http://localhost:8007/](http://localhost:8007/)    


> http://localhost:8007/ 로 접속하면 http://localhost:8007/`front/`에서 서비스 된다.        
스프링부트 웹서비스(포트 : 8007) 에서 SpringBoot 와 Vue 가 같이 동작한다.    
Vue 페이지 (http://localhost:**8080/front/about**) 가    
스프링부트 (http://localhost:**8007/front/about**) 에서도 동일하게 서비스 되는 것을 확인할 수 있다.
{: .notice--info}

![]({{ site.baseurl }}/assets/images/post/vue/boot_build4.png){: style="width:600px" .image_box}


스프링부트와 Vue 프로젝트 설치는 이전글 [[SpringBoot + Vue 설치 바로가기]](/vue/springboot-vue/){: .btn.btn--info.btn--narrow target="_blank" } 참고