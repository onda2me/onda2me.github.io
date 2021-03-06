---
title: "favicon (파비콘 : 즐겨찾기 아이콘) 만들기"
header:
  #teaser: "/assets/images/main/about-01.png"
categories: 
  - favicon
tags:
  - favicon
---

favicon (파비콘)은 즐겨찾기 아이콘을 뜻하는 말로 즐겨찾기 (favorites) 와 아이콘 (icon) 의 합성어이다.  
사이트 접속 시 웹브라우저에 보이는 조그만 아이콘이 바로 파비콘이다.  

> ![]({{ site.baseurl }}/assets/images/post/favicon000.png)  

이 글은 그림판 같은 윈도우 기본 프로그램을 이용하여 간단하게 파비콘을 만들 수 있는 방법을 소개한다.    
그림판을 이용하기에 복잡한 디자인의 아이콘은 만들기 어렵지만,  
네이버나 다음과 같이 영어단어로 구성 된 아이콘은 쉽게 작업이 가능하다.

---

#### 1. 그림판 등 프로그램을 열어 파비콘으로 사용할 아이콘을 만든다.  

 > ![]({{ site.baseurl }}/assets/images/post/favicon00.png){: style="width:400px"}

#### 2. 이미지 크기를 50x50으로 만들어 그림파일로 저장한다.  

  > ![]({{ site.baseurl }}/assets/images/post/favicon01.png){: style="width:350px"}  

**Note:** 16X16 크기로 만들어야 하나 이미지 크기가 너무 작아 작업하기 불편하고,
이미지 컨버터에서 변환 가능하므로 50x50으로 만들었다.
{: .notice--info}

#### 3. 파비콘 컨버터 사이트에 접속하여 그림파일을 업로드한다.  

 > ![]({{ site.baseurl }}/assets/images/post/favicon02.png){: style="width:600px"}

**Note:** https://favicon.io/favicon-converter/  (검색창에 favicon generator 로 검색하여 다른 사이트를 이용해도 무방하다.)
{: .notice--info}

#### 4. 생성된 파비콘을 다운로드 받는다.  

   > ![]({{ site.baseurl }}/assets/images/post/favicon03.png){: style="width:300px"}


#### 5. 서버에 favicon 이미지 업로드하고, html 페이지에 코드를 추가한다.
   
```html
<!-- favicon -->
<link rel="icon" href="/assets/images/main/favicon.ico">
```  
  

#### 6. favicon 이 적용되었는지 확인한다.
 > ![favicon]({{ site.baseurl }}/assets/images/post/favicon04.png){: style="width:600px"}
    

---

**Notice!** 차후에 네이버 검색엔진 등록 후 수집결과를 확인해보니 검색엔진에서 데이타 수집 시 favicon의 주소를 root 디렉토리에서 검색하여
아래와 같이 오류가 발생하기에 favicon 위치를 root 디렉토리로 변경하였다.  <2021년 10월 변경>
{: .notice--warning}
#### favicon URL 변경

+ 기존주소 :  https://onda2me.github.io/assets/images/post/favicon.ico
+ 변경주소 : https://onda2me.github.io/favicon.ico    


**[네이버 검색엔진 수집현황 결과]**
 > ![]({{ site.baseurl }}/assets/images/post/favicon05.png){: style="width:600px"}
