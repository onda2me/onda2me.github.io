---
title:  "SpringBoot 환경에서 Security를 이용한 접근권한 관리하기"
-- published: false
categories: 
  - java
tags:
  - springboot
  - java
  - security
header:
  teaser: /assets/images/post/spring/springboot_security_01.png  
---
Spring Security는 스프링 기반 어플리케이션의 보안과 인증을 담당하는 프레임워크로, 사용자 인증 및 보안 처리를 간단하게 구현할 수 있다.     

이 글은 SpringBoot 2.7.8 환경에서 접근권한을 설정하였으며, 
Spring MVC 환경의 설정은 [이전글 보기](/java/spring-security-4.2/){: .btn.btn--primary.btn--narrow target="_blank" }를 참고한다.  

### 1. 개발환경
+ Eclipse 2021-06 (4.20.0) + Spring Tools 4
+ Java 1.11
+ SpringBoot 2.7.8
+ Spring 5.3.25
+ Tomcat 9.0
+ MySQL
{: .notice--info}

### 2. Security dependency 추가
@ pom.xml 
```xml
<properties>
  <version>2.7.8</version>
</properties>
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
```
+ 스프링부트 프로젝트 Dependencies  
  ![]({{ site.baseurl }}/assets/images/post/spring/springboot_security_02.png){: style="width:400px" .image_box}

### 3. application.properties 설정

@ application.properties
```properties
# spring security 설정
spring.security.user.name = admin
spring.security.user.password = 1122
```
### 4. Security Config 클래스 작성

@ HttpSecurityConfig.java
```java
@Configuration
@EnableWebSecurity
public class HttpSecurityConfig {
    
  @Bean
  public SecurityFilterChain configure(HttpSecurity http) throws Exception {
    
    http
      .authorizeRequests()
          .antMatchers("/").permitAll()
          .antMatchers("/static/**").permitAll()       // 로그인 없이 모든 접근 허용
          .antMatchers("/sign/**").permitAll()         // 로그인 없이 모든 접근 허용
          .antMatchers("/shop/**").permitAll()         // 로그인 없이 모든 접근 허용
          .antMatchers("/mypage/**").authenticated()   // 로그인한 모든 사용자 접근 허용
          .antMatchers("/product/**").hasAnyRole("AD") // 로그인한 관리자만 접근 허용 
          .antMatchers("/member/**").hasRole("AD")     // 로그인한 관리자만 접근 허용
          .anyRequest().anonymous()     // 인증 불필요
          .and()
      .formLogin();

    return http.build();
  }   
}  
```
+ security 관련 dependency를 추가하면, 별도의 설정을 하지 않아도 인증기능이 활성화 되어 login 페이지로 이동
+ application.properties에 설정한  user 정보를 입력하면 로그인 성공  
  ![]({{ site.baseurl }}/assets/images/post/spring/springboot_security_01.png){: style="width:400px" .image_box}


> **🠗 로그인 페이지 및 로그인 성공/실패에 대한 인증 커스텀**    
{: .notice}
### 5. Security Config 클래스 수정

@ HttpSecurityConfig.java 
```java

@Configuration
@EnableWebSecurity
public class HttpSecurityConfig {
  /*
    로그인 설정 : start
    springboot에서 기본 제공하는 페이지를 사용할 경우 설정하지 않아도 됨.
  */   
  private final String SIGN_FAILURE_URL = "/sign/login?error=fail";
    
  @Bean(name="authManager")
  public AuthenticationManager authManager() {
      return new ProviderManager(authProvider());
  }  
  @Bean(name="failHandler")
  public SignAuthenticationFailHandler failHandler() {
      return new SignAuthenticationFailHandler(SIGN_FAILURE_URL);
  }    
  @Bean(name="successHandler")
  public SignAuthenticationSuccessHandler successHandler() {
      return new SignAuthenticationSuccessHandler();
  }    
  @Bean(name ="authProvider")
  public SignAuthenticationProvider authProvider() {
      return new SignAuthenticationProvider(authService());
  }
  @Bean(name ="authService")
  public SignAuthenticationService authService() {
      return new SignAuthenticationService();
  }
  public BCryptPasswordEncoder passwdEncoder() {
      return new BCryptPasswordEncoder();
  }
  /*
    로그인 설정 : end
  */      
  
  @Bean
  public SecurityFilterChain configure(HttpSecurity http) throws Exception {
    
    http
      .authorizeRequests()
          .antMatchers("/").permitAll()
          .antMatchers("/static/**").permitAll()       // 로그인 없이 모든 접근 허용
          .antMatchers("/sign/**").permitAll()         // 로그인 없이 모든 접근 허용
          .antMatchers("/shop/**").permitAll()         // 로그인 없이 모든 접근 허용
          .antMatchers("/mypage/**").authenticated()   // 로그인한 모든 사용자 접근 허용
          .antMatchers("/product/**").hasAnyRole("AD") // 로그인한 관리자만 접근 허용 
          .antMatchers("/member/**").hasRole("AD")     // 로그인한 관리자만 접근 허용
          .anyRequest().anonymous()     // 인증 불필요
          .and()
      .formLogin()
      /*
        로그인 설정 : start
        여기서부터는 로그인 페이지를 직접 설정한 경우로
        springboot에서 기본 제공하는 페이지를 사용할 경우 설정하지 않아도 됨.
      */      
        .loginPage("/sign/login")
        .usernameParameter("id")
        .passwordParameter("pwd")
        .successHandler(successHandler())
        .failureHandler(failHandler());
      /*
        로그인 설정 : end
      */
    return http.build();
  }   
}  
```

### 6. 인증관련 UserSignDetails 클래스 생성
@ UserSignDetails.java
```java
/*
  Spring Security UserDetails 구현체
*/   
public class UserSignDetails implements UserDetails {
  
  private MemberVo member;
  private Collection<? extends GrantedAuthority> authorities;
  private boolean enabled;  
  private boolean credentialsNonExpired;  
  private boolean accountNonExpired;
  
  public UserSignDetails(MemberVo member) {    
    this.member = member;

    // 초기데이타는 true -> db값에 따라 차후 변경
    this.enabled = true;
    this.credentialsNonExpired = true;
    this.accountNonExpired = true;
  }  
  public MemberVo getMember() {      
    return this.member;
  }
  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }
  @Override
  public String getPassword() {    
    return member.getPwd();
  }
  @Override
  public String getUsername() {
    return member.getId();
  }
  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }
  public void setCredentialsNonExpired(boolean credentialsNonExpired) {
    this.credentialsNonExpired = credentialsNonExpired;
  }
  public void setAccountNonExpired(boolean accountNonExpired) {
    this.accountNonExpired = accountNonExpired;
  }

  @Override
  /**
   * 계정만료여부
   */
  public boolean isAccountNonExpired() {
    return this.accountNonExpired;
  }

  @Override
  /**
   * 계정잠금여부
   */
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  /**
   * 계정비밀번호만료여부
   */
  public boolean isCredentialsNonExpired() {
    return this.credentialsNonExpired;
  }

  @Override
  /**
   * 계정활성화여부
   */
  public boolean isEnabled() {
    return this.enabled;
  }

```
### 7. 인증관련 UserAuthenticationService 클래스 생성

@ UserAuthenticationService.java
```java
/*
  Spring Security UserDetailsService 구현체
*/ 
@Service("com.onda2me.app.security")
public class SignAuthenticationService implements UserDetailsService {

  @Autowired 
  private MemberMapper memberMapper;  

  public SignAuthenticationService() {    

  }
  public SignAuthenticationService(MemberMapper memberMapper) {
    this.memberMapper = memberMapper;
  }

  @Override
  public UserSignDetails loadUserByUsername(String id) throws UsernameNotFoundException {
    MemberEntity member = memberMapper.select(id);
    
    if(member == null) {
        throw new UsernameNotFoundException(id + " UsernameNotFound ");
    }
    
    return UserSignDetails(EntityMapperUtil.map(member, MemberVo.class));
  }
}
```
### 8. 인증관련 SignAuthenticationProvider 클래스 생성

@ SignAuthenticationProvider.java
```java
/*
  Spring Security AuthenticationProvider 구현체
  사용자의 아이디와 비밀번호로 인증 수행
*/ 
@Component
public class SignAuthenticationProvider implements AuthenticationProvider { 
  
  private Logger logger = LoggerFactory.getLogger(SignAuthenticationProvider.class);
  
  @Autowired   
  private SignAuthenticationService authService;     
  public SignAuthenticationProvider(SignAuthenticationService authService) {
    this.authService = authService;
  }  

  @Override
  public Authentication authenticate(Authentication authentication) throws AuthenticationException {
    
    UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) authentication; 
    BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();

    String userId = (String)authToken.getName();    
    String userPwd = (String)authToken.getCredentials();
    String loginChannel = null;
    
    // STEP1. 사용자정보 조회
    UserSignDetails userDetails = authService.loadUserByUsername(userId);
    
    // STEP2. 비밀번호 체크
    if(!pwdEncoder.matches(userPwd, userDetails.getPassword())) {
      
      logger.error("authenticate.user.pwd --------------- BadCredentialsException");      
      throw new BadCredentialsException(userId + "Invalid password");
    }
    
    // STEP3. ROLE 설정
    List<GrantedAuthority> roles = new ArrayList<GrantedAuthority>();
    roles.add(new SimpleGrantedAuthority("ROLE_" + String.valueOf(userDetails.getMember().getRoleCode()))); 

    return new UsernamePasswordAuthenticationToken(userDetails, userPwd, roles);
  }

  @Override
  public boolean supports(Class<?> authentication) {
    return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
  }
}
```
### 9. 인증관련 SignAuthenticationSuccessHandler 클래스 생성

@ SignAuthenticationSuccessHandler.java
```java
/*
  Spring Security 로그인 성공 구현체
*/
@Component
public class SignAuthenticationSuccessHandler extends SavedRequestAwareAuthenticationSuccessHandler {

  private Logger logger = LoggerFactory.getLogger(this.getClass());

  @Autowired 
  private SignAuthenticationService authService;
  
  public SignAuthenticationSuccessHandler(SignAuthenticationService authService) {    
    this.authService = authService;
  }  
  public SignAuthenticationSuccessHandler() {
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
  private void authSuccProcess(HttpSession session, HttpServletResponse response, HttpServletRequest request, Authentication    authentication) throws IOException {
    
    UsernamePasswordAuthenticationToken authToken = (UsernamePasswordAuthenticationToken) authentication;
    LoginVo loginVo = null;

    //----------------------------------------------------------------------
    // STEP1. Session & Cookie 저장
    //----------------------------------------------------------------------
    loginVo = new LoginVo(((UserSignDetails)authToken.getPrincipal()).getMember());
    loginVo.setSessionId(request.getRequestedSessionId());
    SessionUtil.addLoginSession(session, loginVo);
  }  
}
```
### 10. 인증관련 SignAuthenticationFailHandler 클래스 생성

@ SignAuthenticationFailHandler.java
```java
/*
  Spring Security 로그인 실패 구현체
*/
@Component
public class SignAuthenticationFailHandler implements AuthenticationFailureHandler { 

  private Logger logger = LoggerFactory.getLogger(this.getClass());
  private String defaultFailureUrl;
    
  public SignAuthenticationFailHandler() {

  }  
  public SignAuthenticationFailHandler(String defaultFailureUrl) {
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
    else if (exception instanceof AuthenticationCredentialsNotFoundException) {
        errorMessage = "인증 요청이 거부되었습니다. ";
    }
    // ETC Exception 
    else {
        errorMessage = "알 수 없는 이유로 로그인에 실패하였습니다";
    }
    request.setAttribute("errorMessage", errorMessage); 
    request.getRequestDispatcher(defaultFailureUrl).forward(request, response);
  }
}
```
### 11. 인증관련 로그인 컨트롤러 생성

@ SignController.java
```java
@Controller
public class SignController {

  private static final Logger logger = LoggerFactory.getLogger(SignController.class);
  
  @RequestMapping(value = "/sign/login")               
  public String login(Authentication auth, @RequestParam HashMap<String, Object> paramMap) { 
      
      logger.debug("\n\n--------------------------------------------------");
      logger.debug("SignController.login");
      logger.debug("auth: " + auth);       
      logger.debug("paramMap: " + paramMap);
      logger.debug("--------------------------------------------------\n\n");
              
      return "/html/sign/login"; 
  }     
}
```

### 12. 인증관련 로그인 페이지 생성

@ /sign/login.html
```html
<form action="/sign/login" method="post">
<input type="hidden" th:name="_csrf" th:value="${_csrf.token}" />

<div class="shadow p-4 m-4 bg-white">
  <div class="login-container ">
    <div class="row main-head ">
       <div class="h2 fw-bolder w3-center ">  
         Login
       </div>  
    </div>

    <label for="uname"><b>User Id</b></label>
    <input type="text" placeholder="Enter Username" name="id" required>

    <label for="psw"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" name="pwd" required>

    <div th:if="${param.error}" class="alert alert-warning my-3 py-3">
        <strong>error!!</strong> : <span th:text=${errorMessage}></span>
    </div>
    <div class="row">
      <div class="col-6"><button type="submit">Login</button></div>
      <div class="col-6"><button type="button" class="cancelbtn" onclick="goHref('/')">Cancel</button></div>
    </div>   
    
  </div>
</div>
</form>
```

### 13. 웹에서 확인
 
@ 로그인 페이지  
![]({{ site.baseurl }}/assets/images/post/spring/springboot_security_04.png){: style="width:600px" .image_box}

@ 로그인 실패 페이지    
![]({{ site.baseurl }}/assets/images/post/spring/springboot_security_05.png){: style="width:600px" .image_box}  
