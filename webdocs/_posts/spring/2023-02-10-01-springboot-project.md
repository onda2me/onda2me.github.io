---
title: "이클립스에서 Spring Boot 프로젝트 시작하기"
categories: 
  - springboot
tags:
  - springboot
---

이클립스에서 Spring Starter Project를 이용하여 Spring Boot 프로젝트 생성하고 웹에서 실행해 보자.

**@ 개발환경** 
+ Eclipse 2021-06 (4.20.0) + Spring Tools 4
+ Java 11
+ MySQL
+ Maven
{: .notice--info}

## 1. 프로젝트 생성하기

### + Spring Starter Project 
> File > New Project > Spring Boot > Spring Starter Project    

![]({{ site.baseurl }}/assets/images/post/spring/boot_01.png){: style="width:450px" .image_box}

### + Project Name 및 Package 설정
![]({{ site.baseurl }}/assets/images/post/spring/boot_02.png){: style="width:350px" .image_box}

### + Project Dependencies 설정
![]({{ site.baseurl }}/assets/images/post/spring/boot_03.png){: style="width:350px" .image_box}
  
스프링부트 웹서버를 기동하여 웹에서 확인하는 것이 목표라면 Spring Web만 선택해도 무방
{: .notice--info}


## 2. 프로젝트 생성결과    
> + src/main/java - java 소스 폴더
+ src/main/resources - 설정 파일 폴더
{: .notice}

![]({{ site.baseurl }}/assets/images/post/spring/boot_04.png){: style="width:350px" .image_box}

## 3. 프로젝트 설정
### + application.properties 설정
```
server.port=8007
```

## 4. HomeController.java 작성
```java
package com.onda2me.app.controller;

@RestController
public class HomeController {

	private static final Logger log = LoggerFactory.getLogger(HomeController.class);
    
	@RequestMapping(value="/home")  
	public String home(Model model) { 			
		return "home";
	}			
}
```
## 5. 웹에서 확인    
![]({{ site.baseurl }}/assets/images/post/spring/boot_05.png){: style="width:600px" .image_box}



