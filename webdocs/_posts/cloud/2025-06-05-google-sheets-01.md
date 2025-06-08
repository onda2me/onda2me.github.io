---
title: "구글 시트로 웹에서 공유가능한 무료데이타 시각화 리포트 만들기"
excerpt: "구글 시트로 웹에서 공유가능한 무료데이타 시각화 리포트 만들기"
categories: 
  - google
tags:
  - google
  - sheets
  - chart
  - 무료차트
header:
  teaser: /assets/images/post/cloud/sheets-00.png

---

> **구글 Sheets(Google Sheets)**는 구글에서 제공하는 웹 기반의 스프레드시트 애플리케이션으로 마이크로소프트의 엑셀(Microsoft Excel)과 유사한 기능을 갖고 있지만, 클라우드 기반으로 인터넷으로 어디서든 접속이 가능하며 자동 저장 기능으로 작업 중 데이터 손실을 방지한다.
{: .notice--info}


## 1. 주요 기능   

### 1) 클라우드 기반
+ Google Drive에 저장되며, 인터넷으로 어디서든 접속 가능 
+ 자동 저장 기능으로 작업 중 데이터 손실 방지

### 2) 실시간 협업 및 공유
+ 여러 사용자가 동시에 문서를 열고 수정 가능
+ 변경사항이 실시간 반영, 댓글이나 제안 모드로 의견 교환도 가능
+ 웹으로 리포트 형식의 공유가 가능

### 3) 엑셀과의 호환성
엑셀파일(.xlsx)을 열 수 있고, 구글 시트 문서를 엑셀 파일로도 다운로드 가능

### 4) 함수
+ SUM, IF, VLOOKUP, QUERY, ARRAYFORMULA 같은 다양한 함수 제공

## 2. 기본적인 사용법   
> 리포트: 월별 판매량을 보여주는 차트가 포함된 리포트 만들기 
{: .notice--info}


### 1) Google Sheets 접속
 + 구글시트 접속하기   
  [구글시트 바로가기](https://docs.google.com/spreadsheets/){: .btn.btn--primary.btn--narrow target="_blank" }      

 + 새 스프레드시트 만들기    
 ![구글시트]({{ site.baseurl }}/assets/images/post/cloud/sheets-01.png){: style="width:600px" .image_box}


### 2) 데이타 입력하기
 + 표형식으로 데이타 입력   
   ![구글시트]({{ site.baseurl }}/assets/images/post/cloud/sheets-02.png){: style="width:400px" .image_box}

### 3) 차트 추가하기
 + Insert > Chart   
   ![구글시트]({{ site.baseurl }}/assets/images/post/cloud/sheets-03.png){: style="width:400px" .image_box}

 + View > Show > Gridlines 체크 해제   
   ![새데이타소스]({{ site.baseurl }}/assets/images/post/cloud/sheets-04.png){: style="width:600px" .image_box}

 + Chart 선택 > Customize > Series > 수익 -> Right axis   
   ![새데이타소스]({{ site.baseurl }}/assets/images/post/cloud/sheets-05.png){: style="width:600px" .image_box}   

### 4) 차트 공유
 + File > Share > Publish to web   
   ![차트]({{ site.baseurl }}/assets/images/post/cloud/sheets-06.png){: style="width:400px" .image_box}

 + Link > Publish   
    > - Link는 웹페이지 형식으로 공유
    > - Embed는 Iframe 방식으로 웹페이지내에 포함 가능

   ![차트]({{ site.baseurl }}/assets/images/post/cloud/sheets-07.png){: style="width:600px" .image_box}
  
    ```html
    <!-- 포함하고자 하는 웹페이지내에 소스 추가 -->
https://docs.google.com/spreadsheets/d/e/2PACX-1vRtRrgXcMLJyLtYgHl1Cwg0jd-xxxxx/pubhtml
    ```

  + 웹페이지에서 확인하기   
  [보고서 예제 바로가기](https://docs.google.com/spreadsheets/d/e/2PACX-1vRtRrgXcMLJyLtYgHl1Cwg0jd-JHDuMQSerakHVPwslyX_AGsU9SbMODlyFCnA0OxGbmxhAQL0dtx7s/pubhtml){: .btn.btn--primary.btn--narrow target="_blank" }    
   ![차트]({{ site.baseurl }}/assets/images/post/cloud/sheets-08.png){: style="width:400px" .image_box}    


--- 
## + 참고

+ [구글 Sheets 바로가기](https://lookerstudio.google.com/){: target="_blank" }
+ [구글 Sheets를 이용한 보고서 바로가기](https://docs.google.com/spreadsheets/d/e/2PACX-1vRtRrgXcMLJyLtYgHl1Cwg0jd-JHDuMQSerakHVPwslyX_AGsU9SbMODlyFCnA0OxGbmxhAQL0dtx7s/pubhtml){: target="_blank" }
+ [Looker Studio와 Sheets를 Embed 형식으로 이용한 웹페이지 바로가기](https://ondago365.web.app/entrance/ratingHighsc.html){: target="_blank" }




