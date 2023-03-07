---
title: "이클립스에서 Spring Boot 프로젝트 DB 설정하기"
categories: 
  - springboot
tags:
  - springboot
header:
  teaser: /assets/images/post/spring/bootdb_00.png
---

Spring Boot 프로젝트에서 Mybatis + MySQL 조합으로 DB정보를 설정하고, 사용자 테이블(t_demo_user)의 데이타를 조회하는 간단한 기능을 만들어 보자.    
Mybatis는 자바객체와 SQL의 자동맵핑 기능을 제공하는 ORM (Object Relational Mapping) 프레임워크이며,
Mybatis-Spring 연동모듈은 Mybatis와 Spring을 간단하게 연동해준다.

+ DB 테이블 : t_demo_user    
  
| seq | userId | email | userName | statusCode | loginYmd |  
| :--: | :-- | :-- | :-- | :-- | :-- |      
| 1 | user1 | user1@email.com | 1번 사용자 | 01 | 20200101 |
| 2 | user2 | user2@email.com | 2번 사용자 | 01 | 20220202 |
| 3 | user3 | user3@email.com | 3번 사용자 | 01 | 20220303 |

**@ 개발환경** 
+ Eclipse 2021-06 (4.20.0) + Spring Tools 4
+ Java 11
+ MySQL
+ Maven
+ Spring Boot 2.7.8
{: .notice--info}

## 1. pom.xml 
> mysql, mybatis dependency 추가

```xml
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
```

>  Java, Spring, Mybatis 버전에 따라 지원가능 여부가 다르므로 버전을 고려하여 dependency에 추가한다. 
[버전별 지원여부 확인](http://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/){: .btn.btn--primary.btn--narrow target="_blank" }   
{: .notice--info}

| MyBatis-Spring-Boot-Starter | MyBatis-Spring | Spring Boot | Java |    
| :-- | :-- | :-- | :--      
| 3.0 | 3.0 | 3.0 | Java 17+ |
| 2.3 | 2.1 | 2.5~2.7 | Java 8+ |
| 2.2 | 2.0.6+ | 2.5~2.7 | Java 8+ |
| 2.1 | 2.0.6+ | 2.1~2.4 | Java 8+ |    

## 2. applicaion.properties   
> DB 주소 및 계정, mybatis 설정 추가

```properties
#datasource 설정
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.url=jdbc:mysql://db_ip
spring.datasource.username=db_id
spring.datasource.password=db_pwd

#mybatis 설정
mybatis.type-aliases-package=com.onda2me.app.dto
mybatis.mapper-locations:classpath:mapper/*-mapper.xml
```

## 3. UserModel.java
```java
public class UserModel {
	private int seq;
	private String userId;
	private String userName;
	private String email;
	private String statusCode;
	private String loginYmd;
	
	public String toString() {
		return "User[" +
			"seq=" + seq +
			", userName=" + userName +
			", email=" + email +
			", statusCode="+statusCode+
			", loginYmd="+loginYmd+"]";
	}
}
```

## 4. UserMapper.java
```java
@Mapper
public interface UserMapper {
	
	public UserModel selectActiveUser(String userId);	
}
```

## 5. UserService.java
```java
@Service
public class UserService {

	@Autowired 
	private UserMapper userMapper;
	
	public UserService(UserMapper userMapper) {
		this.userMapper = userMapper;
	}
	public UserModel selectActiveUser(String userId) {
		
		return userMapper.selectActiveUser(userId);
	}	
}
```

## 6. user-mapper.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper
	 PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
	 "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
    	 
<mapper namespace="com.onda2me.app.mapper.UserMapper">	
	<select id="selectActiveUser"  parameterType="String" resultType="com.onda2me.app.model.UserModel">
		select * from demo_t_user 
		where userId = #{userId} and statusCode = '01'
	</select>				
</mapper>
```

## 7. UserControler.java
```java
@RestController
public class UserControler {

    @Autowired
    private UserService userService;
       
    @RequestMapping(value = "/user/detail", method = RequestMethod.GET)
    public String user_detail(Model model) {

		UserModel user = userService.selectActiveUser("user01");
		return user.toString();
	}		
}
```
## 8. Falcon1bootApplication.java
```java
@SpringBootApplication
@MapperScan(basePackages="com.onda2me.app.mapper")
public class Falcon1bootApplication {

	public static void main(String[] args) {
		SpringApplication.run(Falcon1bootApplication.class,  args);
	}
}
```

## 9. 프로젝트 구조
![]({{ site.baseurl }}/assets/images/post/spring/bootdb_01.png){: style="width:200px" .image_box}

## 10. 스프링부트 실행
![]({{ site.baseurl }}/assets/images/post/spring/bootdb_00.png){: style="width:600px" .image_box}

## 11. 웹에서 확인    
![]({{ site.baseurl }}/assets/images/post/spring/bootdb_02.png){: style="width:600px" .image_box}



## * 참고
> SpringBoot에서 디자인 화면을 적용하는 방법은 
[SpringBoot에서 Html Thymeleaf 서비스 구성하기](/springboot/01-springboot-thymeleaf/){: .btn.btn--primary.btn--narrow target="_blank" } 참고
{: .notice--info}

