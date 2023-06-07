---
title: "라이엇 게임즈의 오픈API를 이용한 롤 전적 검색 사이트 만들기 (2/2)"
categories: 
  - springboot
tags:
  - springboot
  - thymeleaf
  - bootstrap
header:
  teaser: /assets/images/post/riot/riot_lol2.gif  
---

## UI 구성 및 구현 기능
+ 소환사명으로 검색해서 puuid, 프로필아이콘, 레벨 등 정보 조회한다.
+ 조회 한 puuid로 매치 목록 및 랭크정보를 조회한다.
{: .notice} 

![]({{ site.baseurl }}/assets/images/post/riot/riot_lol2.gif){: style="width:800px" .image_box}   

## 서비스 구성도
![]({{ site.baseurl }}/assets/images/post/riot/riot_api_23.png){: style="width:800px" .image_box}   

## 소환사 정보 Riot API 

> + 소환사 정보 조회 API [/summoner-v4/getBySummonerName](https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName){: .btn.btn--primary.btn--narrow target="_blank" }    
> + 기능 구현에 필요한 클래스명, 변수 등을 샘플로 제공

![]({{ site.baseurl }}/assets/images/post/riot/riot_api_21.png){: style="width:700px" .image_box}   


> @소환사정보 성공 반환 예    

```json
{
    "id": "t3NZih8VVi3WRSEvB_41RGMvP3D23g3L0MtddktfFiI96Q",
    "accountId": "ceduA2tauQCaMeWbgpjb8EkZDkze_7RCHjV1IITqHp-p",
    "puuid": "tA6UrLlPTNvFgTJxJcxJgDAHYK4NzM7J4M7NZN_13npN_6GkuPct4FDUs0SIByPRMtEdIuZXa47Irw",
    "name": "Hide on bush",
    "profileIconId": 6,
    "revisionDate": 1685986581250,
    "summonerLevel": 665
}
```
> @ 소환사정보 오류 반환 예    

```json
{
    "status": {
        "message": "Data not found - summoner not found",
        "status_code": 404
    }
}
```


### 1. 소환사 클래스 작성
> @ SummonerDto.java

```java
@Getter
@Setter
@ToString
// SUMMONER-V4 에서 제공한 클래스명과 변수명을 동일하게 작성
public class SummonerDto {
  private String accountId;
  private int profileIconId;
  private long revisionDate;
  private String name;
  private String id;
  private String puuid;
  private long summonerLevel;
}
```

### 2. 응답처리 클래스 작성
> @ ResponseDto.java

```java
@Getter
@Setter
@ToString
@JsonIgnoreProperties(ignoreUnknown = true)
public class ResponseDto {

  // 응답 오류 시
  private StatusDto status;

  // 응답 성공 시 
  private String responseBody;
  
  public ResponseDto(String responseBody) {
      this.responseBody = responseBody;     
  }  
  public ResponseDto(int status_code, String message) {      
      this.status = new StatusDto(status_code, message);
      this.responseBody = message;
  }

  // 응답 성공여부 (true :성공, false :실패)
  public boolean isOK() {      
    if(this.status != null)
      return false;
      
    return true;
  }
}
```

### 3. 공통 변수 클래스 작성
> @ RiotConstant.java

```java
@Component("RiotConstant")
public class RiotConstant {
    
  public static final String API_KEY = "RGAPI-21a527f1-e969-412a-0000-000000000000";
  
  // SUMMONER-V4, ACCOUNT-V1, LEAGE-V4
  public static final String API_SERVER_KR = "https://kr.api.riotgames.com";
  
  // Match-V5, Tournament API
  public static final String API_SERVER_ASIA = "https://asia.api.riotgames.com";    
}
```


### 4. 공통 통신 클래스 작성
> @ RiotHttpClient.java

```java
public class RiotHttpClient {

  private static final Logger logger = LoggerFactory.getLogger(RiotHttpClient.class);

  /**
   * 소환사명으로 소환사 정보조회
   */
  public ResponseDto getSummonersByName(String name) {

    StringBuilder bld = new StringBuilder("/lol/summoner/v4/summoners/by-name/").append(name);
     
    return getRiotResponse(RiotConstant.API_SERVER_KR, bld.toString());      
  } 

  /**
   * Riot 서버에 연결하여 정보조회
   */
  public ResponseDto getRiotResponse(String server, String requestURL) {
    
    ResponseDto responseDto = null;
    StringBuilder httpURL = new StringBuilder();
    ObjectMapper mapper = new ObjectMapper();
    
    try {

      // 서버 + URI + parameter + api key 주소 생성
      httpURL
        .append(server).append(requestURL).append(StringUtil.isContain(requestURL, "?") ? "&" : "?")
        .append("api_key=").append(RiotConstant.API_KEY);
      
      HttpRequest httpReqeust = HttpRequest.newBuilder(URI.create(httpURL.toString())).build();
      HttpResponse<String> httpResponse = HttpClient.newHttpClient().send(httpReqeust, BodyHandlers.ofString());
      
      // 정상 (= 200) 이 아니면 오류 발생
      if(httpResponse.statusCode() != 200) {
          
        responseDto = mapper.readValue(httpResponse.body(), ResponseDto.class);
        throw new BusinessException(responseDto.getStatus().getMessage());
      }
      
      // 반환 객체에 저장
      responseDto = new ResponseDto(httpResponse.body());
      
    } catch (BusinessException ex) {
        
      logger.error(ex.getMessage());
    } catch (Exception ex) { // ConnectException ... etc

      ex.printStackTrace();  
      responseDto = new ResponseDto(500, ex.getCause() + " " + StringUtil.nullToString(ex.getMessage()));
    }
  
    return responseDto;
  }
}
```

### 5. 메인 컨트롤러 작성
> @ RiotMainController.java

```java
@Controller
@RequestMapping("/riot")
public class RiotMainController {

  private final Logger logger = LoggerFactory.getLogger(RiotMainController.class);  
  /*   
   ## 유효한 모든 Data Dragon 버전
    https://ddragon.leagueoflegends.com/api/versions.json   
   */
  @RequestMapping(value = "/main", method = RequestMethod.GET)
  public String main(Model model, @RequestParam HashMap<String, String> paramMap) 
    throws UnsupportedEncodingException, JsonMappingException, JsonProcessingException {
      
      ResponseDto responseDto = null;
      SummonerDto summoner = new SummonerDto();
      StatusDto status = new StatusDto();
      
      //-------------------------------------------
      // 파라미터 초기화 
      //-------------------------------------------
      paramMap.put("start", "0");  // 매치목록 5개씩 처리하기 위한 변수
      paramMap.put("count", "5");  // 매치목록 5개씩 처리하기 위한 변수      
      paramMap.put("name", StringUtil.nullToString(paramMap.get("name"), ""));
        
      //-------------------------------------------
      // 소환사명으로 소환사정보 검색 
      //-------------------------------------------        
      if("".equals(paramMap.get("name")) == false) {
            
        String name = URLEncoder.encode(paramMap.get("name"), "UTF-8");
        responseDto = new RiotHttpClient().getSummonersByName(name);
            
        ObjectMapper mapper = new ObjectMapper();

        status = responseDto.getStatus();
            
        if(responseDto.isOK()) {    
          summoner = mapper.readValue(responseDto.getResponseBody(), SummonerDto.class);
        } 
      } 

      model.addAttribute("status", status);
      model.addAttribute("summoner", summoner);
      model.addAttribute("paramMap", paramMap);
        
      return "/html/riot/main";
  }    
}
```

### 5. 메인 화면 작성
> @main.html

```html
<div class="search-container">
  <form id="frm" name="frm" action="/riot/main">
    <input type="hidden" id="puuid" name="puuid" th:value="${summoner.puuid}">
    <input type="hidden" id="id" name="id" th:value="${summoner.id}">
    <input type="text" name="start" th:value="${paramMap.start}" maxlength="2" size="1">
    <input type="text" name="count" th:value="${paramMap.count}" maxlength="2" size="1">
    <input type="text" name="name" th:value="${paramMap.name}" placeholder="소환사명을 입력하세요." maxlength="20" size="20" onclick="this.select()">
    <button type="button" onclick="goAction('/riot/main')">Go</button>
  </form>
</div>

<th:block th:if="${paramMap.name.isEmpty()}">
  <div class="alert alert-primary h6">
    <strong>&lt; 소환사명 &gt;</strong>을 입력하면 롤 전적을 확인할 수 있습니다.
  </div>

  <div class="row p-2 text-start">
    <div class="col-9">
      <button class="btn btn-outline-secondary" onclick="clickName('HideOnBush')">HideOnBush &nbsp;&nbsp;<i class="fa fa-search"></i></button>
    </div>
  </div>
  
  <div class="row p-2 text-start">
    <div class="col-9">
      <button class="btn btn-outline-primary" onclick="clickName('SIBALife')">SIBALife &nbsp;&nbsp;<i class="fa fa-search"></i></button>
    </div>
  </div>
    <div class="row p-2 text-start">
    <div class="col-9">
      <button class="btn btn-outline-secondary" onclick="clickName('너뒤에그림자있다')">너뒤에그림자있다 &nbsp;&nbsp;<i class="fa fa-search"></i></button>
    </div>
  </div>         
</th:block>

<th:block th:if="${not #strings.isEmpty(paramMap.name)}">
  <div class="card shadow mh-100" >
    <div class="card-body">
      <div class="row">
        <div class="col-5 profile-container " >
          <img th:src="|https://ddragon.leagueoflegends.com/cdn/13.10.1/img/profileicon/${summoner.profileIconId}.png|" th:alt="${summoner.profileIconId}" style="width:100%">
          <span class="ribbon" th:text="${summoner.summonerLevel}">0</span>                  
        </div>
        <div class="col-7">
          <th:block th:if="${summoner.name == null}">
            <p class="fs-6 fw-semibold text-primary" ><br/>소환사정보를 찾을 수 없습니다.</p>
          </th:block>
          <th:block th:if="${status != null}">
          <p class="text-secondary">&lt;<span th:text="${status.status_code}"></span>&gt; <span th:text="${status.message}"></span></p>
          </th:block>
          <th:block th:if="${summoner.name != null}">
            <p class="name" th:text="${summoner.name}"></p>
            <p class="small time">최근 업데이트 : <span class="time" th:text="${@DateUtil.getDateTimeFormat(summoner.revisionDate)}"></span></p>
            <!--  visually-hidden  -->
            <div class="small"> 
              <p class="visually-hidden">summonerId : <span class="text-secondary" th:text="${summoner.id}">-</span></p>
              <p class="visually-hidden">accountId : <span class="text-secondary" th:text="${summoner.accountId}">-</span></p>
              <p class="visually-hidden">puuid : <span class="text-secondary" th:text="${summoner.puuid}">-</span></p>          
            </div>
          </th:block>          
        </div>
      </div>
    </div>
  </div>
</th:block>    
```    

### 6. 동작 확인
![]({{ site.baseurl }}/assets/images/post/riot/lol_22.png){: style="width:700px" .image_box} 

### P.S.

+ 라이엇은 데이타 드래곤을 통해 챔피언, 아이템, 룬, 소환사, 프로필 아이콘등 롤 게임 데이터 및 자산을 중앙 집중화하여 관리한다.
+ 데이타 드래곤의 버전은 자주 업데이트 되므로 최신 버전을 체크하여 이용하도록 한다.
+ 데이타 드래곤 관련문서
   + https://developer.riotgames.com/docs/lol#data-dragon
+ 유효한 데이타 드래곤 버전확인 
   + https://ddragon.leagueoflegends.com/api/versions.json
+ 검색 사이트 구성에 필요한 이미지 활용 (23년 6월 기준 최신버전 13.10.1)
   + http://ddragon.leagueoflegends.com/cdn/13.10.1/img/item/<아이템아이디>.png
   + http://ddragon.leagueoflegends.com/cdn/<버전>/img/champion/<챔피언이름>.png
   + https://ddragon.leagueoflegends.com/cdn/<버전>/img/profileicon/<소환사아이콘아이디>.png
{: .notice} 

---
### Reference    
+ [Riot Developer API](https://developer.riotgames.com/apis){: target="_blank" }

  

      



