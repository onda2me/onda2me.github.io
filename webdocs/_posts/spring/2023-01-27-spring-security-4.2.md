---
title:  "Spring Security를 이용한 접근권한 관리"
-- published: false
categories: 
  - java
tags:
  - spring
  - java
  - security

---
Spring Security는 스프링 기반 어플리케이션의 보안과 인증을 담당하는 프레임워크로,    
Spring Security를 Filter에 추가하여 동작하기 때문에 Spring MVC와 분리되어 동작한다.     

이 글은 Spring Security 5.0.7.RELEASE 를 기반으로 접근권한을 설정하였으며, 
이전버전(3.1.1)의 설정은 [이전글 보기](/java/spring-security/){: .btn.btn--primary.btn--narrow target="_blank" }를 참고한다.  

​Spring Security는 페이지별 접근권한을 설정파일로 관리하며, 디렉토리별로 또는 개별 페이지마다 권한 설정이 가능하다.    
인증에 따른 접근권한은 아래와 같이 설정할 수 있다.     


+ ​로그인페이지 (/sign/loginForm.co)는 로그인을 하기위한 주소이므로 로그인 없이 접속이 가능해야 하고,    
+ 마이페이지 (/mypage/view.co)는 로그인한 사용자만 접속이 가능해야 하며,    
+ 사용자 관리페이지 (/admin/user/list.co)는 로그인한 관리자만 접속이 가능해야 한다.  


**@ 개발환경** 
+ Eclipse 2021-06 (4.20.0) + Spring Tools 4
+ Java 1.8
+ MySQL
{: .notice--info}

**@ 접근권한 설정 예** 
```xml
<intercept-url pattern="/sign/**" access="permitAll" /><!-- 로그인 없이 접근 가능 -->
<intercept-url pattern="/mypage/**" access="isAuthenticated()" /> <!-- 로그인 후에만 접근 가능 -->
<intercept-url pattern="/admin/**" access="hasAnyRole('ROLE_ADMIN')" /><!-- ADMIN 권한 접근 가능 -->
<intercept-url pattern="/user/**" access="hasAnyRole('ROLE_USER','ROLE_ADMIN')" /><!-- USER와 ADMIN 권한 접근 가능 -->      
<intercept-url pattern="/report/view.co" access="hasAnyRole('ROLE_USER')" /><!-- USER 권한 접근 가능 -->         
<intercept-url pattern="/report/update.co" access="hasAnyRole('ROLE_ADMIN')" /><!-- ADMIN 권한 접근 가능 -->        
```      

#### 1.​Spring-Security Library 추가
@ pom.xml 
```xml
<properties>
  <java-version>1.8</java-version>
  <org.springframework-version>5.3.22</org.springframework-version>
  <org.springsecurity-version>5.0.7.RELEASE</org.springsecurity-version>
</properties>
<!-- Spring security -->
<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-web</artifactId>
  <version>${org.springsecurity-version}</version>
</dependency>

<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-config</artifactId>
  <version>${org.springsecurity-version}</version>
</dependency>

<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-core</artifactId>
  <version>${org.springsecurity-version}</version>
</dependency>

<dependency>
  <groupId>org.springframework.security</groupId>
  <artifactId>spring-security-taglibs</artifactId>
  <version>${org.springsecurity-version}</version>
</dependency>	
```

#### 2. ​Spring-Security 설정파일 생성

@ security-context.xml  

```xml
<?xml version="1.0" encoding="UTF-8"?>  
<beans:beans 
  xmlns="http://www.springframework.org/schema/security"
  xmlns:beans="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jee="http://www.springframework.org/schema/jee"
  xsi:schemaLocation="
        http://www.springframework.org/schema/security 
        http://www.springframework.org/schema/security/spring-security-4.2.xsd         
        http://www.springframework.org/schema/beans 
        http://www.springframework.org/schema/beans/spring-beans-4.3.xsd">

  <http pattern="/static/**" security="none"></http>
  <http pattern="/design/**" security="none"></http>
        
  <http auto-config='true' use-expressions="true" authentication-manager-ref="authManager">       
    <intercept-url pattern="/sign/**" access="permitAll" /> <!-- 로그인 없이 접근 가능 -->     
    <intercept-url pattern="/demo/admin/**" access="hasAnyRole('ROLE_ADMIN')" />
    <intercept-url pattern="/demo/user/**" access="hasAnyRole('ROLE_USER','ROLE_ADMIN')" />

    <form-login login-page="/sign/login.co"
                username-parameter="userId"
                password-parameter="userPwd"   
                login-processing-url="/sign/loginProcess.co"
                default-target-url="/index.co" 
                 
                always-use-default-target="true"
                authentication-success-handler-ref="authSuccHandler" 
                authentication-failure-handler-ref="authFailHandler"
                authentication-failure-url="/sign/login.co?error=auth"/>

    <session-management>
      <concurrency-control max-sessions="1" expired-url="/sign/loginDuplicate.co"/>
    </session-management>
  </http>

  <beans:bean id="passwdEncoder" class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder">
  </beans:bean>
  
  <beans:bean id="authFailHandler" class="com.onda2me.app.security.UserAuthenticationFailHandler">
	  <beans:constructor-arg name="defaultFailureUrl" value="/sign/login.co?error=auth"/>
  </beans:bean>
    
  <beans:bean id="authSuccHandler" class="com.onda2me.app.security.UserAuthenticationSuccessHandler" >
    <beans:constructor-arg name="authService" ref="authService" />
  </beans:bean> 

  <beans:bean id="authProvider" class="com.onda2me.app.security.UserAuthenticationProvider" >
    <beans:constructor-arg name="authService" ref="authService" />
  </beans:bean>   

  <beans:bean id="authService" class="com.onda2me.app.security.UserAuthenticationService">
    <beans:constructor-arg name="userMapper" ref="userMapper" />
  </beans:bean> 
  
  <authentication-manager alias="authManager">   
    <authentication-provider ref="authProvider" />
    <authentication-provider user-service-ref="authService" >
	  <password-encoder ref="passwdEncoder" />
    </authentication-provider>    
  </authentication-manager>  
</beans:beans>
```

#### 2. ​Spring-Security 관련 Filter 추가

@ web.xml    
```xml
<context-param>
  <param-name>contextConfigLocation</param-name>
  <param-value>/WEB-INF/spring/root-context.xml, /WEB-INF/spring/security-context.xml</param-value>
</context-param>

<!-- spring security  filter --> 
<filter>
  <filter-name>springSecurityFilterChain</filter-name>	    
  <filter-class>org.springframework.web.filter.DelegatingFilterProxy</filter-class>
</filter>  
<filter-mapping>
  <filter-name>springSecurityFilterChain</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>

```

#### 3. 인증관련 클래스 생성

@ UserAuthenticationService.java 클래스 작성
```java
package com.onda2me.app.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.onda2me.app.mapper.UserMapper;
import com.onda2me.app.vo.UserVo;
/** 
 * Spring Security 사용자인증 관련 클래스
 * DB에서 사용자 정보조회를 담당하는 클래스
 */
@Service("com.onda2me.app.security")
public class UserAuthenticationService implements  UserDetailsService {

	@Autowired
	private UserMapper userMapper;	

	public UserAuthenticationService(UserMapper userMapper) {
		this.userMapper = userMapper;
	}	

	public UserSecurityDetails loadUserByUsername(String userId) throws UsernameNotFoundException {		
		UserSecurityDetails userDetails = null;
		UserVo user = userMapper.selectActiveUser(userId);
		
		if(user == null) {
			throw new UsernameNotFoundException(userId);
		}
		
		userDetails = new UserSecurityDetails(user);
		return userDetails;
	}	
}
```

@ UserAuthenticationProvider.java 클래스 작성
```java
/** 
 * Spring Security 사용자인증 관련 클래스
 * 사용자가 입력한 로그인 정보와 DB의 로그인 정보를 비교해 주는 클래스
 */
@Component
public class UserAuthenticationProvider implements AuthenticationProvider { 
	
	private Logger logger = LoggerFactory.getLogger(UserAuthenticationProvider.class);
	
	@Autowired 
	private UserAuthenticationService authService;
	
	public UserAuthenticationProvider(UserAuthenticationService authService) {		
		this.authService = authService;
	}	
	
	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		
		String user_id = (String)authentication.getPrincipal();    
		String user_pwd = (String)authentication.getCredentials();		 			

		// STEP1. 사용자정보 조회
		UserVo user = (UserVo) authService.loadUserByUsername(user_id);

		// STEP2. 비번일치 체크
		if(!user.getPassword().equals(AESUtil.encrypt(user_pwd))) {
			throw new BadCredentialsException("not matching username or password");
		} 
			
		// STEP3. ROLE권한 설정
		List<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
		roles.add(new SimpleGrantedAuthority("ROLE_" + String.valueOf(user.getRoleCode())));
		
		logger.debug("-----------------------------------------------");	
		logger.debug("authenticate :: ROLE add :" + roles.get(0).getAuthority() );
		logger.debug("-----------------------------------------------");		
				
		return new UsernamePasswordAuthenticationToken(user_id, user_pwd, roles);
	}
}

```
@ UserAuthenticationSuccessHandler.java 클래스 작성 

```java
/**
 * Spring Security 사용자인증 관련 클래스
 * 로그인 성공 후 쿠기 및 세션정보 생성을 담당한다.
 */
public class UserAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	private Logger logger = LoggerFactory.getLogger(this.getClass());

	@Autowired 
	private UserAuthenticationService authService;
	
	@Autowired
	BCryptPasswordEncoder passwdEncoder = null;
	
	public UserAuthenticationSuccessHandler(UserAuthenticationService authService) {		
		this.authService = authService;
	}	
	
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response, Authentication authentication)
            throws ServletException, IOException {
    	
        // 로그인 성공 Process
        authSuccProcess(request.getSession(), response, request, authentication);        
        super.onAuthenticationSuccess(request, response, authentication);
    }
    
    /**
     * 로그인 성공시 세션 정보 세팅
     * 
     * @param session
     * @param response
     * @param authentication
     * @throws IOException 
     */
	private void authSuccProcess(HttpSession session, HttpServletResponse response, HttpServletRequest request, Authentication authentication) throws IOException {
    
		UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) authentication;
		UserSecurityDetails userDetails = (UserSecurityDetails) authToken.getPrincipal();
		LoginUserVo loginVo = null;

		//----------------------------------------------------------------------
		// STEP2. Session & Cookie 저장
		//----------------------------------------------------------------------
		loginVo = new LoginUserVo(userDetails.getUserVo());
		loginVo.setSessionId(request.getRequestedSessionId());
		SessionUtil.addLoginSession(session, loginVo);
    }	
}
```

@ UserAuthenticationFailHandler.java 클래스 작성 

```java
/**
 * Spring Security 사용자인증 관련 클래스
 * 로그인 실패 처리를 위한 클래스
 */
@Component
public class UserAuthenticationFailHandler implements AuthenticationFailureHandler { 

  private Logger logger = LoggerFactory.getLogger(this.getClass());
  private String defaultFailureUrl;

  public UserAuthenticationFailHandler() {
  }

  public UserAuthenticationFailHandler(String defaultFailureUrl) {
    setDefaultFailureUrl(defaultFailureUrl);
  }

  public String getDefaultFailureUrl() {
    return defaultFailureUrl;
  }

  public void setDefaultFailureUrl(String defaultFailureUrl) {
    this.defaultFailureUrl = defaultFailureUrl;
  }

  @Override
  public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
      AuthenticationException exception) throws IOException, ServletException {

    String errorMessage;

    if (exception instanceof UsernameNotFoundException) {
      errorMessage = "아이디가 존재하지 않습니다. ";
    }  
    else if (exception instanceof BadCredentialsException) {
      errorMessage = "아이디 또는 비밀번호가 일치하지 않습니다.";
    }
    else if (exception instanceof CredentialsExpiredException) {
      errorMessage = "아이디 사용기한이 만료되었습니다.";
    } 
    else if (exception instanceof DisabledException) {
      errorMessage = "아이디 사용이 중지되었습니다.";
    } 
    // ETC Exception 
    else {
      errorMessage = "알 수 없는 이유로 로그인에 실패하였습니다";
    }

    // redirect
    SessionUtil.addSession(request.getSession(), "errorMessage", errorMessage);        
    response.sendRedirect(defaultFailureUrl);
  }
}
```

#### 4. 로그인 JSP 파일 작성

@ login.jsp 작성 
```jsp
<form name="frm" autocomplete="off" method="post" action="/sign/loginProcess.co">
  <label class="fs-2">로그인 하기</label>
  <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}" />
  <input class="form-control" name="userId" type="text" value=""/>
  <input class="form-control" name="userPwd" type="password" value="" autocomplete="off" />
  <c:if test="${error ne null}">
  <div class="mb-3 fs--1 fw-medium text-warning">
    ${errorMessage} 
  </div></c:if>                       
  
  <button class="btn btn-primary d-block w-100 mt-3" onclick="goLogin()">Log in</button>                     
</form>
``` 

#### 5. 웹에서 확인

@ 로그인 초기 페이지  
![]({{ site.baseurl }}/assets/images/post/spring/login_01.png){: style="width:500px" .image_box}

@ 로그인 실패 페이지    
![]({{ site.baseurl }}/assets/images/post/spring/login_02.png){: style="width:500px" .image_box}  


@ 접근권한 없는 페이지   
![]({{ site.baseurl }}/assets/images/post/spring/login_03.png){: style="width:500px" .image_box}