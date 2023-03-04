---
title: "Apache Tiles로 레이아웃 템플릿 설정하여 화면 구성하기"
categories: 
  - spring
tags:
  - spring
header:
  teaser: /assets/images/post/spring/tiles_detail02.png 
---

> **Apache Tiles?**    
웹페이지의 Header, Aside, Footer 와 같이 반복적으로 사용되는 코드를 분리하여 관리해주는 프레임워크로 화면의 반복영역을 레이아웃 템플릿으로 관리하므로 중복 코드를 줄일 수 있다.
{: .notice--info}

![]({{ site.baseurl }}/assets/images/post/spring/tiles_layout.png){: style="width:600px" .image_box}

> **Jsp Include 와 Tiles의 공통점 및 차이점**    

+ 공통점      
두기능 모두 화면의 공통영역을 분리하여 관리하므로 중복 코드를 줄일 수 있다.

+ 차이점    
**Jsp Include** 방식은 각 jsp 페이지에서 레이아웃을 설정하므로 전체적인 레이아웃을 변경할 경우 모든 Jsp 파일을 수정해야 한다.     
**Apache Tiles** 방식은 공통부분을 레이아웃 템플릿으로 설정하여 틀을 만들고, 각 content 부분만 바꿔주면서 페이지를 만들어 주기에 설정파일만 변경하면 설정파일을 사용하는 모든 화면의 레이아웃이 변경된다.    

# Apache Tiles로 레이아웃 템플릿 설정하여 화면 구성하기

## 1. pom.xml 의존성 추가
### @pom.xml
```xml
<dependency>
  <groupId>org.apache.tiles</groupId>
  <artifactId>tiles-extras</artifactId>
  <version>3.0.8</version>
</dependency>
<dependency>
  <groupId>org.apache.tiles</groupId>
  <artifactId>tiles-servlet</artifactId>
  <version>3.0.8</version>
</dependency>	 
<dependency>
  <groupId>org.apache.tiles</groupId>
  <artifactId>tiles-jsp</artifactId>
  <version>3.0.8</version>
</dependency> 
```

## 2. WEB-INF>spring>appServlet>servlet-context.xml 설정 추가
### @servlet-context.xml
```xml
<beans:bean id="tilesConfigurer" class="org.springframework.web.servlet.view.tiles3.TilesConfigurer">
    <beans:property name="definitions">
        <beans:list>
            <beans:value>/WEB-INF/config/tiles/tiles.xml</beans:value>
        </beans:list>
    </beans:property>
</beans:bean>
<!-- Tiles viewResolver -->    
<beans:bean id="tilesViewResolver" class="org.springframework.web.servlet.view.UrlBasedViewResolver">
    <beans:property name="viewClass" value="org.springframework.web.servlet.view.tiles3.TilesView" />
    <beans:property name="order" value="1" />
</beans:bean>
<!-- jsp viewResolver : Tiles과 Jsp를 함께 사용하기 위해 jsp의 우선순위를 2로 변경해 준다. --> 
<beans:bean id="viewResolver" class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <beans:property name="prefix" value="/WEB-INF/views/" />
    <beans:property name="suffix" value=".jsp" />
    <beans:property name="order" value="2" />
</beans:bean>
```

## 3. WEB-INF>config>tiles>tiles.xml 파일 작성
### @tiles.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE tiles-definitions PUBLIC "-//Apache Software Foundation//DTD Tiles Configuration 3.0//EN" "http://tiles.apache.org/dtds/tiles-config_3_0.dtd">

<tiles-definitions>
   <definition name="layout" template="/WEB-INF/template/layout-home.jsp">
      <put-attribute name="header" value="/WEB-INF/template/header.jsp"/>
      <put-attribute name="content" value=""/>
      <put-attribute name="footer" value="/WEB-INF/template/footer.jsp"/>
   </definition>
   
   <!-- content -->
   <definition name="*.tiles" extends="layout">
     <put-attribute name="content" value="/WEB-INF/views/{1}.jsp"></put-attribute>
   </definition>

   <definition name="*/*.tiles" extends="layout">
     <put-attribute name="content" value="/WEB-INF/views/{1}/{2}.jsp"></put-attribute>
   </definition>

   <definition name="*/*/*.tiles" extends="layout">
     <put-attribute name="content" value="/WEB-INF/views/{1}/{2}/{3}.jsp"></put-attribute>
   </definition>
   
</tiles-definitions>
```

## 4. WEB-INF>template>header.jsp, footer.jsp, layout.jsp 파일 작성

### @layout.jsp
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="tiles" uri="http://tiles.apache.org/tags-tiles" %>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Tile Layout</title>
    <style>
    .home_header {
      width: auto;
      height: 50px;
      background-color: #3d3d3d;
      color: #ccc;
      padding: 10px 10px;
    }    
    .home_footer {
      width: auto;
      height: 100px;
      background-color: #ccc;
      color: #222;
      padding: 20px 10px;
    }
    </style>

</head>
<body>
  <div>
    <!-- header -->
    <tiles:insertAttribute name="header"/>
   
    <!-- content -->
    <tiles:insertAttribute name="content"/>
    
    <!-- footer -->
    <tiles:insertAttribute name="footer"/>
  </div>
</body>
</html>
```

### @header.jsp
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="home_header">
  <h2>Header</h2>
</div>
```

### @footer.jsp
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="home_footer">
  <h4>Footer</h4>
</div>
```

![]({{ site.baseurl }}/assets/images/post/spring/tiles-dir.png){: style="width:300px" .image_box}

## 5. HomeController.java 파일 작성
```java
@Controller
public class HomeController {

  @RequestMapping(value = "/list.co", method = RequestMethod.GET)
  public String list(Locale locale, Model model) {

	  model.addAttribute("Controller.url", "list.co" );
	  return "list.tiles";
  }	

  @RequestMapping(value = "/detail.co", method = RequestMethod.GET)
  public String detail(Locale locale, Model model) {
	
	  model.addAttribute("Controller.url", "detail.co" );
	  return "detail.tiles";
  }
}
```

## 6. WEB-INF>views>list.jsp, detail.jsp 파일 작성
### @list.jsp
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="pt-5">
  <h2>Content</h2>      
</div>      
<div class="mb-5 pb-5">
  <p>${url} -> list.jsp</p>   
</div>
```

### @detail.jsp
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<div class="pt-5">
  <h2>Content</h2>      
</div>      
<div class="mb-5 pb-5">
  <p>${url} -> detail.jsp</p>   
</div>
```

## 7. 웹에서 확인
### @list.co
![]({{ site.baseurl }}/assets/images/post/spring/tiles_list.png){: style="width:600px" .image_box}
### @detail.co
![]({{ site.baseurl }}/assets/images/post/spring/tiles_detail.png){: style="width:600px" .image_box}

### @디자인 적용한 페이지
![]({{ site.baseurl }}/assets/images/post/spring/tiles_detail02.png){: style="width:600px" .image_box}

> ## 참고 - Jsp Include 방식    

### @list.jsp
```jsp
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Jsp Include - list</title>

    <style>
    .home_header {
      width: auto;
      height: 50px;
      background-color: #3d3d3d;
      color: #ccc;
      padding: 10px 10px;
    }    
    .home_footer {
      width: auto;
      height: 100px;
      background-color: #ccc;
      color: #222;
      padding: 20px 10px;
    }
    .pxy-20 {
      padding: 20px;
    } 
    </style>  

  </head>
  <body>
    <%@ include file="../template/header.jsp" %>
    
    <div class="pxy-20">
      <h2>Content</h2>      
    </div> 
         
    <div class="pxy-20">
      <p>${url} -> list.jsp</p>   
    </div>    
    <%@ include file="../template/footer.jsp" %>       
  </body>
</html>
```


