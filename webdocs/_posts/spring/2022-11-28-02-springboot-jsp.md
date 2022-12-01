---
title: "SpringBoot에서 Jsp 서비스 구성하기"
categories: 
  - springboot
tags:
  - springboot
---

> 스프링부트에서는 Jsp를 Default로 제공하지 않아 Jsp 서비스를 구성하려면 별도의 설정이 필요하다.  

**@ JSP 설정** 
1. pom.xml 의존성 추가   
2. application.properties 설정 추가    
3. src>webapps>WEB-INF>jsp 폴더 추가    
4. Contoller 파일 작성
5. jsp 파일 작성
6. 스프링부트 웹에서 확인
{: .notice--info}


## 1. pom.xml 의존성 추가 
```xml
  <!-- jsp 사용을 위해 추가함 (jasper, jstl) -->
  <dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>jstl</artifactId>	
  </dependency>
  <!-- jsp를 Java Servlet으로 컴파일 -->
  <dependency>
    <groupId>org.apache.tomcat.embed</groupId>
    <artifactId>tomcat-embed-jasper</artifactId>	
  </dependency>
```

## 2. application.properties 설정 추가

```
# use jsp
spring.mvc.view.prefix=/WEB-INF/jsp/
spring.mvc.view.suffix=.jsp
```

## 3. src>webapps>WEB-INF>jsp 폴더 추가

![]({{ site.baseurl }}/assets/images/post/spring/boot_jsp.png){: style="width:350px" .image_box}


## 4. ViewTestController.java 파일 작성

```java
@Controller
public class ViewTestController {

	@GetMapping("/jsp/home")  				
	public String jsphome(Model model, HttpServletRequest req) { 
		
		model.addAttribute("uri", req.getRequestURI());		
		model.addAttribute("nowTime", new Date());
		return "home"; 
	}	
}
```

## 5. src>webapps>WEB-INF>home.jsp 파일 작성
```jsp
  <%@ page language="java" contentType="text/HTML; charset=UTF-8" pageEncoding="UTF-8" %>
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <title>home.jsp</title>
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
        <h1>home.jsp</h1>
        <p>model.time : ${nowTime} </p>
        <p>model.url : ${uri} </p>
      </div>
    </div>
  </body>
</html>
```

## 6. 스프링부트 웹에서 확인
![]({{ site.baseurl }}/assets/images/post/spring/boot_jsp2.png){: style="width:600px" .image_box}

