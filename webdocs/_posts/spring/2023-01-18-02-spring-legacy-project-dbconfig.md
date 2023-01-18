---
title: "이클립스에서 Spring MVC 프로젝트 DB 설정하기"
categories: 
  - spring
tags:
  - spring
---

Spring MVC 프로젝트에서 DB 설정하고 사용자 테이블 (test_user) 의 데이타를 조회하는 간단한 기능을 만들어 보자.

+ table : test_user    

| userId | email | name | statusCode | loginDate |    
| :-- | :-- | :-- | :-- | :-- |        
| 1 | user1@test.com | 1번 사용자 | 01 | 20210101 |    
| 2 | user2@test.com | 2번 사용자 | 01 | 20210201 |    
| 3 | user3@test.com | 3번 사용자 | 01 | 20210301 |    


## 1. @pom.xml 
> mysql, mybatis 관련 dependency 추가
{: .notice}

``` xml
  <!-- DB mysql & mybatis -->
  <dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>8.0.11</version>
  </dependency>    
  <dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.5.10</version>
  </dependency>
  <dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>2.0.7</version>
  </dependency>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>${org.springframework-version}</version>
  </dependency>
  <dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>1.3.2</version>
  </dependency>
```    

## 2. @root-context.xml
> db 서버 및 bean 설정 추가
{: .notice}

``` xml	
    <!-- DB config  --> 
    <bean id="dataSource" class="org.springframework.jdbc.datasource.DriverManagerDataSource" > 
        <property name="driverClassName" value="com.mysql.cj.jdbc.Driver" />    
        <property name="url" value="jdbc:mysql://db_ip/schema?" />
        <property name="username" value="db_user" />
        <property name="password" value="db_pwd" />
    </bean> 
    
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource" />
        <property name="mapperLocations" value="/WEB-INF/mapper/*.xml" />
    </bean> 
                    
    <bean id="sqlSession" class="org.mybatis.spring.SqlSessionTemplate">
        <constructor-arg ref="sqlSessionFactory" />
    </bean> 

    <!-- bean config  --> 
    <bean id="userService" class="com.onda2me.app.service.UserService">
        <constructor-arg ref="userMapper" />
    </bean>
    
    <bean id="userMapper" class="org.mybatis.spring.mapper.MapperFactoryBean">
        <property name="mapperInterface" value="com.onda2me.app.mapper.UserMapper" />
        <property name="sqlSessionFactory" ref="sqlSessionFactory" />
    </bean>
```

## 3. @UserMapper.java
``` java
	@Configuration
	@MapperScan("com.onda2me.app.mapper")
	public interface UserMapper {
		
		public List<HashMap> list(HashMap map);
  }
```

## 4. @UserService.java
``` java
	@Configuration
	@Service("com.onda2me.app.service")
	public class UserService {
	
		@Autowired 
		private UserMapper userMapper;
		
		public UserService(UserMapper userMapper) {
			this.userMapper = userMapper;
		}
		
		public List<HashMap> list(HashMap map) {
			
			return userMapper.list(map);
		}
  }
```
## 5. @UserController.java
``` java
	@Resource
	private UserService userService;	
	
	@RequestMapping(value = "/user/list.co", method = RequestMethod.GET)
	public String list(Model model) {

		List<HashMap> list = userService.list(null);
		model.addAttribute("list", list);
		return "user/list";
  }
```

## 6. @/user/list.jsp
``` jsp
  <h1>Users List</h1>	
  <c:forEach var="user" items="${list}" varStatus="idx">
    <p> [${idx.count}] ${user }</p>
  </c:forEach>
```

## 7. 프로젝트 구조
> config 설정 및 파일 추가한 디렉토리 구조
{: .notice}

![]({{ site.baseurl }}/assets/images/post/spring/springmvc_21.png){: style="width:300px" .image_box}

## 8. 웹에서 확인
[http://localhost:8080/app/user/list.co](http://localhost:8080/app/user/list.co){: .btn.btn--primary.btn--narrow target="_blank" }

![]({{ site.baseurl }}/assets/images/post/spring/springmvc_22.png){: style="width:600px" .image_box}

