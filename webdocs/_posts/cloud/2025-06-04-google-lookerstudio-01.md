---
title: "무료 데이타 시각화 차트인 Looker Studio를 이용한 리포트 작성"
excerpt: "무료 데이타 시각화 차트인 Looker Studio를 이용한 리포트 작성"
categories: 
  - google
tags:
  - google
  - looker studio
  - chart
header:
  teaser: /assets/images/post/cloud/looker01-00.png

---

> **Google Looker Studio**는 데이터 시각화 및 리포트 생성을 위한 무료 BI(Business Intelligence) 도구로, 다양한 데이터 소스를 연결하여 대시보드와 리포트를 만들 수 있다. 코딩 없이도 시각적으로 데이터를 분석하고 공유할 수 있어, 마케팅, 영업, 운영 등 비개발자도 쉽게 사용할 수 있다.
{: .notice--info}


## 1. 주요 기능   

|  기능 |  설명 |    
| :---- | :---- |    
| 데이터 시각화 | 막대 그래프, 선 그래프, 원형 차트, 지도 등 다양한 차트를 지원 |    
| 다양한 데이터 소스 | Google Sheets, BigQuery, Google Ads, Analytics, MySQL, CSV, 3rd party API 등 |    
| 실시간 데이터 연결 | 일부 데이터 소스는 실시간으로 연결되어 최신 데이터 반영 가능 |     
| 협업 지원 | Google Docs처럼 여러 사용자가 실시간으로 편집 가능 |     
| 공유 기능 | 웹 링크 공유, PDF 다운로드, 자동 이메일 보고서 발송 등 |     
| 사용자 정의 필터/매개변수 | 드롭다운, 날짜 선택 등을 통한 대시보드 인터랙션 제공 |    
| 데이터 권한 제어 | 뷰어 별로 필터 제한, 권한 차등 적용 가능 |     

## 2. 사용 예시

  + 마케팅 분석: 광고 성과(클릭, 전환율), 유입 채널 분석
  + 영업 대시보드: CRM 데이터 기반 고객 분석
  + 교육 리포트: 시험 점수, 출석 데이터 시각화
  + 물류/운영 대시보드: 재고, 배송 상태, 처리 시간 등

## 3. 장점과 단점

### 1) 장점
  + 사용이 쉬움 (코딩 없이 시각화 가능)
  + Google 서비스와의 뛰어난 연동성
  + 실시간 공유 및 협업 가능
  + 무료

### 2) 단점
  + 대규모 데이터 처리에는 한계
  + 복잡한 비즈니스 로직/모델링은 어려움

## 3. 기본적인 사용법   
> 리포트: onda2me 사이트 접속자 통계를 보여주는 리포트 만들기
{: .notice--info}

### 1) Looker Studio 접속
 + [루커스튜디오 바로가기](https://lookerstudio.google.com/){: target="_blank" }

### 2) 새 보고서 만들기
 + Reports > Create (Blank Report)    
   ![새보고서]({{ site.baseurl }}/assets/images/post/cloud/looker01-01.png){: style="width:600px" .image_box}

### 3) 데이터 소스 연결 ( 구글 Sheets, Analytics 등)

 + Create > Data sources    
   ![새데이타소스]({{ site.baseurl }}/assets/images/post/cloud/looker01-03.png){: style="width:600px" .image_box}

 + 접속자 통계를 보여주려는 프로젝트 선택   
   ![새데이타소스]({{ site.baseurl }}/assets/images/post/cloud/looker01-04.png){: style="width:600px" .image_box}

### 4) 차트 추가
 + 차트 추가    
   ![차트]({{ site.baseurl }}/assets/images/post/cloud/looker01-05.png){: style="width:600px" .image_box}

 + 시계열 차트 선택    
   ![차트]({{ site.baseurl }}/assets/images/post/cloud/looker01-06.png){: style="width:600px" .image_box}
  
  + 차트 설정
  > Dimension: 날짜, Metric: Active Users     

    ![차트]({{ site.baseurl }}/assets/images/post/cloud/looker01-07.png){: style="width:600px" .image_box}    

  + 컨트롤 추가 (날짜 필터, 정렬 등 선택)    
    ![차트]({{ site.baseurl }}/assets/images/post/cloud/looker01-08.png){: style="width:600px" .image_box}    

  + UI 조정     
    > 위치, 크기 등 조정    

    ![차트]({{ site.baseurl }}/assets/images/post/cloud/looker01-09.png){: style="width:600px" .image_box}    


### 5) 공유하기

  + File > Share    

    > - File > Share는 링크 공유로 웹페이지 형식    
    > - File > Embed report는 Iframe 방식으로 웹페이지내에 포함 가능

    ![차트]({{ site.baseurl }}/assets/images/post/cloud/looker01-10.png){: style="width:600px" .image_box}    

  + Embed report : 리포트를 보여주고자 하는 페이지에 Iframe 소스를 추가    

  ``` html
  <iframe width="600" height="443" src="https://lookerstudio.google.com/embed/reporting/d0756b1b-0000-0000"></iframe>
  ```

  + Google Looker Studio Embed 결과     

    <iframe width="800" height="870" src="https://lookerstudio.google.com/embed/reporting/d0756b1b-28a3-48fa-88c2-307c0f56b4d7/page/FJHNF" frameborder="1" style="border:5px" allowfullscreen sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"></iframe>{: .image_box}    


## + 참고

+ [구글 Looker Studio 바로가기](https://lookerstudio.google.com/){: target="_blank" }




