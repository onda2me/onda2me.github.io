---
title: "SpringBoot Batch Monitoring System"
categories: 
  - springboot
tags:
  - springboot
  - thymeleaf
  - monitoring
header:
  teaser: /assets/images/post/spring/boot_batch_24.png  
---
# 스프링부트 배치 모니터링 시스템 이란?
스프링 배치를 실행하면 실행정보들이 메타 데이타 테이블에 저장되는데, 배치를 실행한 뒤 데이타를 조회할 수 있는 표준 관리도구가 없기에 매번 데이타를 조회를 하려니 불편하기도 하고, 
스프링부트 환경에서 웹 UI 기능도 익힐 겸 모니터링 시스템을 만들어 보았다.   
<!-- **Quartz 관리자 페이지나 Jekins, Teamcity** 가 관리도구 역할을 제공 -->   

이 스프링부트 모니터링 시스템은 Batch Job의 관리도구로써 목적보다는  
+ 스프링부트 환경에서 **DB 접속 + MVC 구조 + Security + Thymeleaf** 를 이용한 UI 구성을 목표로 하였으며 
+ (덤으로) **Job 실행 결과 및 Job이 어떤 Parameter 를 가지고 어느 Step까지 실행**했는지 등을 쉽게 확인하고
+ **Thymeleaf를 이용하여 UI를 적용한 모니터링 시스템**을 만드는 것에 중점을 두었다.

> 배치란 일괄처리란 뜻을 가지며 배치에 대한 내용은 아래 링크를 참고하고, 이 글에서는 모니터링 시스템에 대해서만 설명하려 한다.  

+ **스프링 부트 배치란?**  : [게시글 보기](/springboot/01-springboot-batch-01/){: .btn.btn--primary.btn--narrow target="_blank" }
+ **스프링 부트 배치 Job 만들기**  : [게시글 보기](/springboot/01-springboot-batch-02/){: .btn.btn--primary.btn--narrow target="_blank" }
+ **배치 어플리케이션이란?**  : [참고글 보기](https://jojoldu.tistory.com/325){: .btn.btn--primary.btn--narrow target="_blank" } 

스프링부트 개발환경 적용을 위한 첫 모니터링 시스템은 유료 디자인으로 오픈이 불가하여 Bootstrap의 샘플들을 조합하여 UI를 재구성하고 
**모니터링 + Batch Job 예제**등을 포함한 간단한 데모 프로젝트로 구성했다.  
{: .notice}

> 유료 디자인 적용한 첫 UI    

![]({{ site.baseurl }}/assets/images/post/spring/boot_batch_24.png){: style="width:700px" .image_box}   

> Bootstrap 샘플 디자인 적용한 UI    

![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_01.png){: style="width:700px" .image_box}   

> 배치 정보 메타테이블  
  
![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_00.png){: style="width:700px" .image_box}   

> Batch Meta ERD  

![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_02.png){: style="width:700px" .image_box}  

## 개발 환경
+ Eclipse 2021-06 (4.20.0) + Spring Tools 4
+ Java 11
+ Spring Boot v2.7.8
+ Thymeleaf-spring5 3.0.15
+ Bootstrap v5
+ MySQL
+ Maven

![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_03.png){: style="width:700px" .image_box}  

<!-- 
## 서비스 구성
-->

---

## 배치 모니터링 시스템 

### 1. 프로젝트 생성하기
![프로젝트 생성]({{ site.baseurl }}/assets/images/post/spring/boot_batch_02.png){: style="width:350px" .image_box}

@pom.xml
```xml
<dependencies>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-batch</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-configuration-processor</artifactId>
    <optional>true</optional>
  </dependency>
  <dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
  </dependency>

  <!-- mysql -->
  <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.11</version>
  </dependency>

  <!-- jdbc + mybatis -->
  <dependency>
    <groupId>org.mybatis.spring.boot</groupId>
    <artifactId>mybatis-spring-boot-starter</artifactId>
    <version>2.3.0</version>
  </dependency>
  <dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.1.0</version>
  </dependency>

  <!-- html thymeleaf 사용 -->
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
  </dependency>
  <!-- html thymeleaf layout 사용 -->
  <dependency>
  <groupId>nz.net.ultraq.thymeleaf</groupId>
  <artifactId>thymeleaf-layout-dialect</artifactId>
  </dependency>
  <!-- html thymeleaf sec 사용 -->
  <dependency>
    <groupId>org.thymeleaf.extras</groupId>
    <artifactId>thymeleaf-extras-springsecurity5</artifactId>
  </dependency>        

  <!-- Entity to Vo 객체 변환  -->
  <dependency>
    <groupId>org.modelmapper</groupId>
    <artifactId>modelmapper</artifactId>
    <version>2.3.9</version>
  </dependency>
</dependencies>
```

### 2. SpringBootApplication.java 작성

> + 배치기능을 이용하기 위한 어노테이션 (@EnableBatchProcessing) 추가  

```java
@SpringBootApplication
@EnableAutoConfiguration(exclude = { SecurityAutoConfiguration.class }) // Security 비활성
@ComponentScan(basePackages = "com.onda2me.app")
@MapperScan(basePackages = "com.onda2me.app.mapper")
@EnableBatchProcessing // 배치 사용
public class OndaBootApplication {
    public static void main(String[] args) {
        SpringApplication.run(OndaBootApplication.class, args);
    }
}
```

### 3. application.yml 설정

```yml
#------------------------------------------------
# Web Server Config
#------------------------------------------------  
server:
  port: 8007
  servlet:
    jsp:
      init-parameters:
        development: true

#------------------------------------------------
# Spring Config
# - jsp, Thymeleaf, Security, Batch Job
# - spring.profiles : local / sample
#------------------------------------------------
spring:
  main:
    allow-bean-definition-overriding: true
  datasource:
    driverClassName: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/bootdb
    username: dbuser
    password: dbpwd
    hikari:
      maximum-pool-size: 2
  mvc:
    view:
      prefix: /WEB-INF/jsp
      suffix: .jsp
  security:
    user:
      name: admin01
      password: 1122
      role: ADMIN
#------------------------------------------------      
# controller.view-name : /html/* -> thymeleaf(else jsp) 
#------------------------------------------------      
  thymeleaf:
    cache: false
    check-template-location: false
    enabled: true
    prefix: classpath:/static/templates
    suffix: .html
    view-names: /html/*
#------------------------------------------------
# spring.batch.job.enabled=false/true    
# job.names = simpleJob, multiStepJob
#------------------------------------------------
  batch:
    job:
      enabled: false
#------------------------------------------------
# DB - mybatis config
#------------------------------------------------  
mybatis:
  configuration:
    default-fetch-size: 100
    default-statement-timeout: 30
    map-underscore-to-camel-case: true
  type-aliases-package: com.onda2me.app.entity
  mapper-locations: classpath:mapper/*.xml

#------------------------------------------------
#log file config
#spring.config.activate.on-profile
#------------------------------------------------
logging:
  config: classpath:logging/logback.xml
  
--- #local 환경
spring.config.activate.on-profile: local
server:
   host: local
  
--- #sample 환경
spring.config.activate.on-profile: sample
server:
   host: sample
```     

### 4. Controller 작성

@HomeController.java
```java
@Controller
public class HomeController {
  private static final Logger logger = LoggerFactory.getLogger(HomeController.class);

  @RequestMapping(value="/")  
  public String index(Model model, Principal principal) {     

      logger.debug("---------------------------------");
      logger.debug("index");
      logger.debug("---------------------------------");
      
      return "/html/index";
  }    
}
```

### 5. Thymeleaf 설정
@/templates/layouts/layout-dev.html  
```html
<!DOCTYPE html>
<html lang="ko"
      xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout">      
  <head>
    <head th:replace="/layouts/common-head :: head"></head>
    <th:block layout:fragment="css"></th:block>
  </head>
  <body>
    <div class="body-container">  
      <aside th:replace="/layouts/common-aside :: aside"></aside>
      <div id="main" class="main-container">
        
        <div class="content-container">
          <th:block layout:fragment="content"></th:block>      
        </div>
        <div class="content-container">
          <footer th:replace="/layouts/common-footer :: footer"></footer>
        </div>
      </div>
    </div>
  </body>
  <th:block layout:fragment="script"></th:block>
</html> 
```

@/templates/layouts/common-head.html  
```html
<th:block
      xmlns:th="http://www.thymeleaf.org"
      th:fragment="head">       
  <!--Common Head-->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">    
  <link rel="stylesheet" href="/assets/css/bootstrap.min.css">
  <link rel="stylesheet" href="/assets/css/main.css">  
  <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto'>    

  <script src='https://kit.fontawesome.com/a076d05399.js' crossorigin='anonymous'></script>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.6.3/jquery.min.js"></script>        
</th:block>
```

@/templates/layouts/common-aside.html  
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <th:block th:fragment="common-aside">
    <aside id="sideContainer" class="side-container" >  
      <div class="vertical-menu ">
            
        <div class="btn-group w-100 btn-group-lg"  style="">
          <button type="button" id="homeNav" class="btn btn-success w-100" onclick="goHref('/')"><span class="fa fa-home"></span> Home</button>
        </div>
      
        <a href="#" class="active"><i class="fas fa-thumbtack"></i><span>&nbsp; Ing..</span></a>
        <ul class="side-nav nav flex-column">        
          <li class="nav-item">            
            <a class="nav-link" href="/batch/jobList">/batch/jobList</a>
          </li>
        </ul>
                     
        <a href="#" class="active"><i class="fas fa-arrow-alt-circle-right"></i><span>&nbsp; batch run</span></a>
        <ul class="side-nav nav flex-column">
          <li class="nav-item">
            <a class="nav-link" href="/batch/simpleJob">simpleJob</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/batch/runJob?jobName=multiStepJob">runJob?multiStepJob</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/batch/runJob?jobName=multiTaskletJob&">runJob?multiTaskletJob</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/batch/runJob?jobName=simpleJob&period=daily">runJob?simpleJob&daily</a>
          </li>
        </ul>         
      </div>             
    </aside>
  </th:block>
</html>
```

@/templates/layouts/common-footer.html  
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
  <th:block th:fragment="common-footer">
    <!-- Footer -->  
    <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
      <p class="col-md-4 mb-0 text-muted">&copy; 2022 onda2me, </p>
      <ul class="nav col-md-4 justify-content-end">
        <li class="nav-item"><a href="/" class="nav-link px-2 text-muted" target="_blank">Home</a></li>
        <li class="nav-item"><a href="#" class="nav-link px-2 text-muted" target="_blank">About</a></li>
      </ul>
    </footer>	  
  </th:block>
</html>
```

### 6. html 작성
@/templates/html/index.html  
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{/layouts/layout-dev}">
      
  <th:block layout:fragment="content">          
    <h2>Welcome!! Onda2Me Home</h2>

    <div class="prd-row">
    <th:block th:each="num : ${#numbers.sequence(1,8)}">
    <div class="prd-column nature">     
        <img src="/assets/images/main/mountains.jpg" alt="Mountains" style="width:100%;">
        <div class="prd-content">
            <p class="prd-name">
              <a href="#" class="prd-link">Mountains</a>
            </p>
            <p>판매가 : <span class="" th:text="${num}"></span>0,000 원</p>
            <p>할인가 : <span class="prd-price" th:text="${num}+'0,000'"></span> 원</p>
        </div>    
      </div>
      </th:block>
    </div>   
  </th:block>			
</html>
```

### 7. 웹에서 확인
+ [http://localhost:8007/index](http://localhost:8007/index){: target="_blank" }

![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_11.png){: style="width:700px" .image_box}   


[전체 소스 Github에서 다운로드 받기](https://github.com/onda2me/onda-batch-monitoring){: target="_blank" }
{: .notice}

---   
### Reference
+ [Bootstrap](https://getbootstrap.com/docs/5.3/examples/){: target="_blank" }
+ [Thymeleaf](https://www.thymeleaf.org/doc/tutorials/3.0/usingthymeleaf.html#introducing-thymeleaf){: target="_blank" }
+ [스프링배치 관리도구 참고글](https://jojoldu.tistory.com/489){: target="_blank" }




