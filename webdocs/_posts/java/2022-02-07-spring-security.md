---
title:  "Spring Security 3.1.1를 이용한 접근권한 관리"
categories: 
  - java
tags:
  - spring
  - java
  - security

---
Spring Security는  스프링 기반 어플리케이션의 보안과 인증을 담당하는 프레임워크로,    
Spring Security를 Filter에 추가하여 동작하기 때문에 Spring MVC와 분리되어 동작한다.     

몇개의 페이지를 예로 들면    
+ ​로그인페이지 (/login/loginForm.co)는 로그인을 하기위한 주소로 로그인 없이 접속이 가능해야 하고,    
+ 마이페이지 (/mypage/view.co)는 로그인한 사용자만 접속이 가능해야 하며,    
+ 사용자관리 페이지 (/admin/user/list.co)는 로그인한 관리자만 접속이 가능해야 한다.     

​Spring security는 페이지별 접근권한을 개별 코딩없이 설정한 속성에 따라 관리 해준다.    
디렉토리별로 권한 설정이 용이하며, 페이지별 권한 설정도 가능하다.    

+ 보기권한은 사용자  접근가능 /report/view.co    
+ 수정권한은 매니저만 접근가능 /report/update.co    

@ 접근권한 설정 예    
```xml
<intercept-url pattern="/sign/**" access="permitAll" /><!-- 로그인없이 접근가능 -->
<intercept-url pattern="/mypage/**" access="isAuthenticated()" /> <!-- 로그인후에만 접근가능 -->
<intercept-url pattern="/admin/**" access="hasAnyRole('ROLE_ADMIN')" /><!-- 관리자만 접근가능 -->
<intercept-url pattern="/user/**" access="hasAnyRole('ROLE_USER','ROLE_ADMIN')" /><!-- USER와 ADMIN 권한 접근가능 -->      
<intercept-url pattern="/report/view.co" access="hasAnyRole('ROLE_USER')" /><!-- 사용자 권한 접근가능 -->         
<intercept-url pattern="/report/update.co" access="hasAnyRole('ROLE_MANAGER')" /><!-- 매니저 권한 접근가능 -->        
```      

#### 1.​Spring-Security  Library 추가
@ pom.xml 
```xml
<!-- Spring security -->
<dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-web</artifactId>
    <version>${org.springframework-version}</version>
  </dependency>
  <dependency>
    <groupId>org.springframework.security</groupId>
    <artifactId>spring-security-config</artifactId>
    <version>${org.springframework-version}</version>
</dependency>
```

#### 2. ​Spring-Security 설정파일 생성

@ security-context.xml    
​Spring-security 관련 설정파일 (security-context.xml) 추가

```xml
<?xml version="1.0" encoding="UTF-8"?>

<beans:beans 
  xmlns="http://www.springframework.org/schema/security"
  xmlns:beans="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:jee="http://www.springframework.org/schema/jee"
  xsi:schemaLocation="
	  http://www.springframework.org/schema/security 
	  http://www.springframework.org/schema/security/spring-security-3.1.xsd        
	  http://www.springframework.org/schema/beans 
	  http://www.springframework.org/schema/beans/spring-beans-3.2.xsd">
   
  <http pattern="/statics/**" security="none"></http>
  <http auto-config='true' use-expressions="true">
    <intercept-url pattern="/sign/**" access="permitAll" /><!-- 로그인없이 접근가능 -->
    <intercept-url pattern="/mypage/**" access="isAuthenticated()" /> <!-- 로그인후에만 접근가능 -->
    <intercept-url pattern="/admin/**" access="hasAnyRole('ROLE_ADMIN')" /><!-- 관리자만 접근가능 -->
    <intercept-url pattern="/user/**" access="hasAnyRole('ROLE_USER','ROLE_ADMIN')" /><!-- USER와 ADMIN 권한 접근가능 -->      
    <intercept-url pattern="/report/view.co" access="hasAnyRole('ROLE_USER')" /><!-- 사용자 권한 접근가능 -->         
    <intercept-url pattern="/report/update.co" access="hasAnyRole('ROLE_MANAGER')" /><!-- 매니저 권한 접근가능 -->   

    <session-management>
      <concurrency-control max-sessions="2" expired-url="/sign/loginDuplicate.co"/>
    </session-management>
  </http>

  <beans:bean id="userAuthSuccHandler" class="com.xxx.security.UserAuthenticationSuccessHandler" >
    <beans:constructor-arg name="authService" ref="userAuthService" />
  </beans:bean>	

  <beans:bean id="userAuthenticationProvider" class="com.xxx.security.UserAuthenticationProvider" >
    <beans:constructor-arg name="authService" ref="userAuthService" />
  </beans:bean>	 

  <beans:bean id="userAuthService" class="com.xxx.security.UserAuthenticationService">
    <beans:constructor-arg name="sqlSession" ref="sqlSession" />
  </beans:bean>	
	 	
  <authentication-manager>
    <authentication-provider ref="userAuthenticationProvider"/>
    <authentication-provider user-service-ref="userAuthService" /> 
  </authentication-manager>

</beans:beans>

```

@ web.xml    
Spring-security 관련 Filter (SpringSecurityFilter) 추가    

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
​
```

#### 3. 인증관련 클래스 생성

@ UserAuthenticationService 클래스 생성    
DB에서 사용자 정보조회를 담당하는 인터페이스

```java
@Configuration
@Service("com.xxx.security")
public class UserAuthenticationService implements  UserDetailsService {
	@Autowired 
	private SqlSessionTemplate sqlSession;	

	public UserAuthenticationService() {
	}

	public UserAuthenticationService(SqlSessionTemplate sqlSession) {
		// TODO Auto-generated constructor stub
		this.sqlSession = sqlSession;
	}
	
	@Override
	public UserVo loadUserByUsername(String userId) throws UsernameNotFoundException {
		
		UserVo user = sqlSession.selectOne("selectActiveUser", userId);
		if(user == null ) throw new UsernameNotFoundException(userId);	
		return user;
	}	
}


```
@ UserAuthenticationProvider 클래스 생성    
사용자가 입력한 로그인 정보와 DB의 로그인 정보를 비교해 주는 인터페이스 

```java
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
@ UserAuthenticationSuccessHandler 클래스 생성    
로그인 성공 후 쿠기 및 세션정보 생성을 담당한다.

```java
@Service("com.xxx.security")
public class UserAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

	@Autowired 
	private UserAuthenticationService authService;
	
	public UserAuthenticationSuccessHandler(UserAuthenticationService authService) {
				this.authService = authService;
	}	
	
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws ServletException, IOException {
       	
        super.setUseReferer(true);
        super.onAuthenticationSuccess(request, response, authentication);
             
        // 로그인 성공 Process
        authSuccProcess(request.getSession(), authentication);	
    }
       
    /**
     * 로그인 성공시 세션 정보 세팅
     * @param session
     * @param authentication
     * @throws IOException 
     */
	private void authSuccProcess(HttpSession session, Authentication authentication ) throws IOException {   	

		String user_id = (String)authentication.getPrincipal();    // 아이디
		
		//----------------------------------------------------------------------
		// STEP1. 사용자정보 조회
		//----------------------------------------------------------------------
		UserVo user = authService.loadUserByUsername(user_id);		
		
		LoginVo login = new LoginVo();
		login.setId(user.getId());
		login.setName(user.getName());
		login.setRoleCode(user.getRoleCode());
		
		//----------------------------------------------------------------------
		// STEP2. Session & Cookie 저장
		//----------------------------------------------------------------------		
		SessionUtil.addLoginSession(session, login);
	}
}	

```

