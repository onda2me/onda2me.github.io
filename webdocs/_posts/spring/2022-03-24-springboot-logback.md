---
title: "SpringBoot - Logback 설정하기"
categories: 
  - springboot
tags:
  - springboot
---

**logback?** Apache의 log4j 기반의 logging 라이브러리로 SpringBoot 프로젝트에는 logback이 기본적으로 포함되어 있어서 dependecy 추가없이 사용할 수 있으나,
개발환경에 맞는 설정파일을 추가해 주어야 한다.    
logback은 ERROR > WARN > INFO > DEBUG > TRACE 5단계의 로그레벨을 가진다.    


## 1. logback 설정파일 위치 지정하기    
```
#fileName : application.properties
#로그파일 위치
logging.config=classpath:logging/logback.xml
```

![]({{ site.baseurl }}/assets/images/post/spring/logback_01.png)


## 2. logback.xml 설정파일 추가하기    
> resources > logging > logback.xml
{: .notice--primary}

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
 	
	<!-- 출력설정 -->
	<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
		<layout class="ch.qos.logback.classic.PatternLayout">
			<Pattern>
				%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n
			</Pattern>
		</layout>
	</appender>
 
	<root level="INFO">
		<appender-ref ref="CONSOLE"/>
	</root>
	
	<!-- 패키지별 출력설정 -->
	<logger name="com.onda" level="DEBUG" ></logger>
  	
</configuration>
```

## 3. Controller 에서 로깅 추가하기
    

> #### Java 코드
{: .notice--primary}    

```java
// HelloController.java
@RestController
public class HelloController {

  private static final Logger log = LoggerFactory.getLogger(WelcomeController.class);

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

    /* 
    logback.xml에 INFO 레벨이 기본 출력 설정되어 있어서
    DEBUG 레벨 출력을 원하는 패키지는 설정을 추가해 줘야한다.
    <logger name="com.onda" level="DEBUG" ></logger>
    */
    log.debug(user.toString()); // Debug Level
    log.info(user.toString());  // Info Level

    return user;
  }	
}

// User.java
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

  public String toString() {
    return "User -> id:"+id+", name:"+name;
  }		
}
```

> #### 로깅 확인
{: .notice--primary}

![]({{ site.baseurl }}/assets/images/post/spring/logback_02.png)


## 4. logback 설정 커스트마이징 

> 개발/운영 환경에 따라 설정정보를 다르게 설정할 경우

```
#fileName : application.properties

#로그파일 위치
logging.config=classpath:logging/logback.xml

#환경에 따라 설정정보를 다르게 관리할 경우 (dev / prod)
spring.profiles.active = dev
```

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
 	
	<!-- 출력설정 -->
	<appender name="CONSOLE" class="ch.qos.logback.core.ConsoleAppender">
		<layout class="ch.qos.logback.classic.PatternLayout">
			<Pattern>
				%d{yyyy-MM-dd HH:mm:ss} [%-5level] %logger{36} - %msg%n
			</Pattern>
		</layout>
	</appender>
 
	<root level="INFO">
		<appender-ref ref="CONSOLE"/>
	</root>
	
  <!-- dev env : debug 레벨이상 출력 -->
  <springProfile name="dev"> 
    <logger name="com.onda" level="DEBUG" ></logger>
  </springProfile>

  <!-- prod env : info 레벨이상 출력 --> 
  <springProfile name="prod"> 
    <logger name="com.onda" level="INFO" ></logger>
  </springProfile>
  	
</configuration>
```


    