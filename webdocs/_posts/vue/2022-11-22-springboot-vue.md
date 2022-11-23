---
title: "SpringBoot BackEnd + Vue FrontEnd Step1. 서비스 구성"
sidebar:
  nav: "docs_vue"
categories: 
  - vue
tags:
  - vue
  - springboot
---

> 스프링부트 웹서버는 8007, Vue 웹서버는 8080 포트로 서비스 하도록 설정    

1. 스프링부트 프로젝트 생성    
2. 스프링부트 프로젝트에 Vue 프로젝트 생성    
3. Vue 빌드 시 스프링부트의 리소스 폴더로 build 경로 설정    
4. 스프링부트 서버에서 Vue 웹서비스 동작 확인
{: .notice--info}


## 1. 스프링부트 프로젝트 생성
> New Project > Spring Starter Project

![]({{ site.baseurl }}/assets/images/post/vue/boot_setup.png){: style="width:350px" .image_box}

## 2. WelcomeController 작성
> com.onda.controller.WelcomeController.java

```java
@RestController
public class WelcomeController {
	@GetMapping("welcome")  	
	public String welcome() { 
		
		System.out.println("welcome!!");
		return "welcome!!"; 
	}
}
```

## 3. 스프링부트 서버 실행
> SpringBootApplication.java > Run As > Spring Boot App 실행

![]({{ site.baseurl }}/assets/images/post/vue/boot_setup2.png){: style="width:600px" .image_box}


## 4. 웹서비스 동작 확인
> [http://localhost:8007/welcome](http://localhost:8007/welcome)

![]({{ site.baseurl }}/assets/images/post/vue/boot_setup3.png){: style="width:600px" .image_box}

## 5. Vue 프로젝트 생성
> vue create srcvue

![]({{ site.baseurl }}/assets/images/post/vue/boot_setup4.png){: style="width:250px" .image_box}

## 6. Vue 서버 실행
> npm run serve

![]({{ site.baseurl }}/assets/images/post/vue/boot_setup50.png){: style="width:600px" .image_box}


## 7. Vue 웹서비스 동작 확인
> [http://localhost:8080/](http://localhost:8007/)

![]({{ site.baseurl }}/assets/images/post/vue/boot_setup5.png){: style="width:600px" .image_box}


스프링부트 서버에서 서비스 되도록 Vue build 설정은 다음글에서 이어서 설명합니다.   
[[Vue build 설정 바로가기]](/vue/springboot-vue-build/){: .btn.btn--info.btn--narrow target="_blank" }