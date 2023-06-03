---
title: "라이엇 게임즈의 오픈API를 이용한 롤 전적 검색 사이트 만들기 (1/2)"
categories: 
  - springboot
tags:
  - springboot
  - thymeleaf
  - bootstrap
header:
  teaser: /assets/images/post/riot/lol_01.png  
---

## 프로젝트 진행 동기 ?
+ 공부도 잠도 휴식도 모두 버리고, 롤에만 올인하는 아들의 감시 및 취미 목적의 프로젝트
+ 라이엇 게임즈의 오픈 API를 이용한 op.gg 나 lol.ps 같은 롤 전적 검색 및 분석 사이트까지는 아니고,
+ 게임의 승패가 그날의 컨디션을 좌우하는 게임러의 주변인을 위해
+ 게임 진행상황 및 승패 여부만 확인할 수 있는 간단한 미니 프로젝트이며
+ 스프링부트 + 부트스트랩 + Thymeleaf + Ajax + Json 환경으로 구성하였다.
{: .notice} 

## UI 구성
![]({{ site.baseurl }}/assets/images/post/riot/lol_01.png){: style="width:800px" .image_box}   

## UI 구성별 기능
1. 소환사명으로 검색
2. 프로필아이콘, 레벨, 최근 업데이트 등의 소환사 정보
3. 솔로 랭크 전적 및 차트
4. 최근 게임 매치 정보
5. 최근 게임 매치 차트
6. 게임 매치 더보기 (5개씩 조회)
{: .notice} 


## 1. RIOT API 인증키 신청

### 1-1. Riot Developer 사이트 접속

> + 라이엇 게임즈 사이트 [https://developer.riotgames.com/](https://developer.riotgames.com/){: .btn.btn--primary.btn--narrow target="_blank" }    
> + 회원가입
> + My Account > DASHBOARD > API KEY 신청   

![]({{ site.baseurl }}/assets/images/post/riot/riot_01.png){: style="width:700px" .image_box}   

### 1-2. API 인증키 신청
> + PRODUCTION API KEY : 상업용
> + PERSONAL API KEY : 개인용
> + DEVELOPMENT API KEY : 신청 즉시 발급, 24시간 유효

![]({{ site.baseurl }}/assets/images/post/riot/riot_02.png){: style="width:700px" .image_box} 


## 2. 주요 API 목록
+ 라이엇 게임즈 API 사이트  [https://developer.riotgames.com/apis](https://developer.riotgames.com/apis){: .btn.btn--primary.btn--narrow target="_blank" }
{: .notice} 

### 2-1. SUMMONER-V4 - 소환사정보 조회

> + 소환사명 으로 puuid, 레벨, 프로필아이콘, 최근 업데이트 시간 정보 반환
> + /lol/summoner/v4/summoners/by-name/{summonerName}  

![]({{ site.baseurl }}/assets/images/post/riot/riot_api01.png){: style="width:700px" .image_box} 

### 2-2. MATCH-V5 - 게임정보 조회 

> + 소환사의 게임정보 반환 
> + /lol/match/v5/matches/by-puuid/{puuid}/ids   

![]({{ site.baseurl }}/assets/images/post/riot/riot_api02.png){: style="width:700px" .image_box} 

### 2-3. CHAMPION-MASTERY-V4 - 유저, 챔피언 숙련도 조회

> + 소환사의 챔피언 숙련도 정보 반환
> + /lol/champion-mastery/v4/champion-masteries/by-summoner/{encryptedSummonerId}  

![]({{ site.baseurl }}/assets/images/post/riot/riot_api03.png){: style="width:700px" .image_box} 


### 2-4. LEAGUE-V4 - 리그정보 조회 

> + 랭크별(솔로/자유), 티어별, 등급별 소환사정보 반환
> + /lol/league/v4/entries/by-summoner/{encryptedSummonerId}    

![]({{ site.baseurl }}/assets/images/post/riot/riot_api04.png){: style="width:700px" .image_box} 


## 3. 서비스 구성

> + Ajax로 내부 API를 호출하면 라이엇게임즈 API의 데이타를 가져오는 방식으로 구현

![]({{ site.baseurl }}/assets/images/post/riot/riot_service.png){: style="width:700px" .image_box} 


## 4. 초기 화면
![]({{ site.baseurl }}/assets/images/post/riot/lol_00.png){: style="width:700px" .image_box} 

### P.S.

+ 라이엇 게임즈의 오픈 API를 이용하기 위해서는 인증키 요청 및 승인 과정이 필요하다.
+ 신청 실수로 1회 Reject 되어 승인까지 총 10일 정도가 소요되었다.
+ 임시 API Key는 즉시 발급되어 바로 사용 가능하나, 24시간 후에는 만료되어 재발급해야 한다.
+ 소환사, 매치, 솔로/자유랭크, 리그 등 롤에 대한 지식이 없어서 제공된 API로 기능을 구현하는데 어려움이 있었다.
{: .notice} 

---
### Reference    
+ [Liot Developer API](https://developer.riotgames.com/apis){: target="_blank" }
+ [RIOT API를 이용해서 롤 전적 검색 사이트](https://velog.io/@junhok82/series/PROJECT){: target="_blank" }

  

      



