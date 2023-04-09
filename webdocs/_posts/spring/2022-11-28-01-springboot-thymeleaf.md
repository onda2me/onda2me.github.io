---
title: "SpringBoot에서 Html Thymeleaf 서비스 구성하기"
categories: 
  - springboot
tags:
  - springboot
  - thymeleaf
header:
  teaser: /assets/images/post/spring/boot_html01.png  
---

**Thymeleaf 란?**    
html 태그를 기반으로 컨트롤러가 전달하는 데이터를 동적으로 화면을 구성할 수 있게 해 준다.


**@ Thymeleaf 설정** 
1. pom.xml 의존성 추가   
2. application.properties 설정 추가    
3. src>static>templates>html 폴더 추가    
4. Contoller 파일 작성
5. jsp 파일 작성
6. 스프링부트 웹에서 확인
{: .notice--info}


## 1. pom.xml 의존성 추가 
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-thymeleaf</artifactId> 
</dependency>
```

## 2. application.properties 설정 추가
```
# jsp와 구분하기 위해 웹에서 html/* 주소로 호출되는 경우 Thymeleaf 처리되도록 설정
spring.thymeleaf.view-names=html/*
spring.thymeleaf.prefix=classpath:/static/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.cache=false
spring.thymeleaf.check-template-location=false
```

## 3. src>static>templates>html 폴더 추가

![]({{ site.baseurl }}/assets/images/post/spring/boot_html.png){: style="width:350px" .image_box}


## 4. ViewHtmlController.java 파일 작성

```java
@Controller
@Controller
public class ViewHtmlController {

	@GetMapping("/html/home")  				
	public String htmlhome(Model model, HttpServletRequest req) { 
		
		model.addAttribute("uri", req.getRequestURI());		
		model.addAttribute("nowTime", new Date());
		return "html/home"; 
	}	
}
```

## 5. src>static>templates>html>home.html 파일 작성
```html
<!DOCTYPE html>
<html>
 <head>
   <meta charset="UTF-8">
   <title>home.html</title>
   <style>  
      /* Container holding the image and the text */
	   .container {
	     width: 1000px;
	     text-align: center;
	     position: relative;
	   }       
	   /* Bottom right text */
	   .text-block {
	     position: absolute;
	     bottom: 20px;
	     right: 20px;
	     background-color: black;
	     color: white;
	     padding-left: 20px;
	     padding-right: 20px;
	     text-align: left;
	   }   
   </style>  
  </head>
  <body>
    <div class="container">    
      <img src="/assets/images/main/img_nature_wide.jpg" width="100%">
      <div class="text-block">
        <h1>home.html</h1>
        <p>model.time : <span th:text="${nowTime}"></span></p>
        <p>model.url : <span th:text="${uri}"></span></p>
      </div>
    </div>
  </body>
</html>
```

## 6. 스프링부트 웹에서 확인
+ **/html/home**로 접속 시 Controller가 전달하는 데이타를 받을 수 있다.    
+ **/templates/html/home.html**로 접속 시 Controller의 데이타를 받을 수 없다.    

![]({{ site.baseurl }}/assets/images/post/spring/boot_html01.png){: style="width:700px" .image_box}    
![]({{ site.baseurl }}/assets/images/post/spring/boot_html02.png){: style="width:700px" .image_box}


## 참고. Jsp와 Html에서 Controller 데이타 받기
```html
<!-- JSP에서 데이타 받기 -->
<div class="text-block">
  <h1>home.jsp</h1>
  <p>model.time : ${nowTime} </p>
  <p>model.url : ${uri} </p>
</div>

<!-- Thymeleaf Html에서 데이타 받기 -->
<div class="text-block">
  <h1>home.html</h1>
  <p>model.time : <span th:text="${nowTime}"></span></p>
  <p>model.url : <span th:text="${uri}"></span></p>
</div>      
```