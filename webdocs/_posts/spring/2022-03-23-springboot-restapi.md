---
title: "SpringBoot - REST API 구현하기"
categories: 
  - springboot
tags:
  - springboot
---

**REST API**란? **Representational State Transfer**의 약자이며 '대표적인 상태 전달'이라는 뜻으로 하나의 URI는 하나의 Resource를 대표하도록 설계된다는 개념이다. 
즉, 스마트폰, 태플릿, PC 등 다양한 단말장치에 상관없이 공통으로 데이터를 처리할 수 있도록 사용자가 어떤 요청을 했을 때 화면 (HTML)을 리턴하지 않고 데이타만 리턴해주는 방식이다.    

SpringBoot를 이용하여 간단하게 REST API를 구현해 보자.    

## 1. SpringBoot 프로젝트 생성    
> 이클립스 : File > New > Project > Spring Starter Project
{: .notice--primary}

<!-- Spring Web이 Dependencies에 추가되어 프로젝트가 생성된다.    -->

![]({{ site.baseurl }}/assets/images/post/spring/new_01.png)  


## 2. 컨트롤러 작성
![]({{ site.baseurl }}/assets/images/post/spring/new_03_controller.png)    

### Case1. String형으로 리턴
    

> #### Java 코드
{: .notice--primary}    

```java
@RestController
public class HelloController {
	 
  /**
    * Welcome을 반환한다.
    * @return Welcome
    */
    @GetMapping("api/welcome") 
    @ResponseBody 
    public String apiWelcome() { 
      return "Welcome"; 
  }
}
```

> #### URI 호출
{: .notice--primary}


![]({{ site.baseurl }}/assets/images/post/spring/new_04.png)

### Case2. Json형으로 리턴
    

> #### Java 코드
{: .notice--primary}    

```java    
/**
* Welcome을 Json 형식으로 반환한다.
* @return {"message":"Welcome"}
*/
@GetMapping("api/json") 
@ResponseBody 				  
public Map<String, String> apiJson() { 
  
  Map<String, String> map = new HashMap<>(); 
  map.put("message", "Welcome"); 
  return map; 
}

```
> #### URI 호출
{: .notice--primary}    

![]({{ site.baseurl }}/assets/images/post/spring/new_05.png)

### Case3. 객체를 Json형으로 리턴
    

> #### Java 코드
{: .notice--primary}    

```java

@RestController
public class HelloController {
  /**
    * 객체를 Json 형식으로 변환한다.
    * @return {"id":100,"name":"onda2me"}
    */
  @GetMapping("api/user")
  @ResponseBody 
  public User apiUser() {
    
    User user = new User();		
    user.setId(100);
    user.setName("onda2me");
    
    return user;
  }
}

// User Class 생성
public class User {
	
	private int id;
	private String name;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}	
}
```

> #### URI 호출
{: .notice--primary}    
![]({{ site.baseurl }}/assets/images/post/spring/new_06.png)

---

## 3. Trouble Shooting #1
SpringBoot 프로젝트 생성 후 첫 실행 시 아래와 같은 오류가 발생하는 경우 !!    
**Failed to configure a DataSource :** DataSource 설정을 하지 않아서 발생하는 오류    

![]({{ site.baseurl }}/assets/images/post/spring/new_07_error.png)

> `1. pom.xml에 DB Connector Library를 추가한다.`
{: .notice--warning}


```xml
<!-- https://mvnrepository.com/artifact/mysql/mysql-connector-java -->
<dependency>
  <groupId>mysql</groupId>
  <artifactId>mysql-connector-java</artifactId>	
</dependency>
```

> `2. resources에 application.properties 파일을 추가하여 DB정보를 설정한다.`
{: .notice--warning}

![]({{ site.baseurl }}/assets/images/post/spring/new_08_error.png)    

```
# application.properties 설정
# 웹서버 포트 기본:8080, 아래와 같이 다른 포트로 변경하여 사용가능
server.port=9000

# database 설정
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://yours_database_url
spring.datasource.username=yours_database_user
spring.datasource.password=yours_database_password
```
