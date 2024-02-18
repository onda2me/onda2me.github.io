---
title: "R을 이용한 통계분석 - R의 패키지"
categories: 
  - data
tags:
  - data
  - dikw
  - r
  - phython
header:
  teaser: /assets/images/post/data/data-r02-44.png  
---

R 프로그램을 설치하면 base, datasets, graphics 등 기본 패키지가 자동 설치되고, 메모리에 로딩되어 사용할 수 있다.  
이외에 필요한 함수는 패키지 단위로 직접 설치하여 사용할 수 있도록 설치 및 삭제 기능을 제공한다.

## 1. R에 설치된 패키지 확인 

RStudio 오른쪽 하단창의 패키지창에서 설치 된 패키지 목록을 확인할 수 있다.

![R의 설치 패키지]({{ site.baseurl }}/assets/images/post/data/data-r02-10.png){: style="width:600px" .image_box} 

R에서 기본으로 제공하는 패키지외에 다른 패키지를 사용하려면 직접 패키지를 R에 설치해야 하는데, 패키지는 최초 1회만 설치하고, 패키지 로드(메모리에 패키지를 적재하는 작업)는 패키지를 사용할 때마다 수행해야 한다. 대신 한번 `메모리에 로드된 패키지는 R프로그램이 종료되기 전까지 유지`된다.
{: .notice--info}
  

## 2. R에 설치할 수 있는 패키지

[https://cloud.r-project.org/](https://cloud.r-project.org/web/packages/available_packages_by_name.html){: .btn.btn--info.btn--narrow target="_blank" }

![R의 설치 패키지]({{ site.baseurl }}/assets/images/post/data/data-r02-20.png){: style="width:600px" .image_box} 


R은 2024/02/17일 기준 약 20,000개의 패키지가 있고, 오픈 프로젝트로 패키지의 제작과 배포가 자유롭기에 앞으로도 계속 증가할 것으로 보이므로 모든 패키지를 파악하고, 사용하기는 불가능해 보인다.   

따라서 `데이터 분석의 목적에 맞는 패키지를 찾아 효과적으로 활용하는 것도 프로그램 분석 능력`이라고 볼 수 있다.

> **R의 주요 패키지**
+ 텍스트, csv 파일 처리 : readr [readr](https://cloud.r-project.org/web/packages/readr/index.html){: .btn.btn--inverse.btn--narrow target="_blank" } 
+ 엑셀파일 처리 :  readxl [readxl](https://cloud.r-project.org/web/packages/readxl/index.html){: .btn.btn--inverse.btn--narrow target="_blank" } 
+ 데이터 정렬, 집계, 필터 : dplyr [dplyr](https://cloud.r-project.org/web/packages/dplyr/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
+ 문자열 처리 : stringr [stringr](https://cloud.r-project.org/web/packages/stringr/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
+ 그래프 : ggplot2 [ggplot2](https://cloud.r-project.org/web/packages/ggplot2/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
+ 웹 대시보드 : shiny [shiny](https://cloud.r-project.org/web/packages/shiny/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
+ 지리 지도 : maps [maps](https://cloud.r-project.org/web/packages/maps/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
+ 구글 지도 : ggmap [ggmap](https://cloud.r-project.org/web/packages/ggmap/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
+ 구글 차트 : googleVis [googleVis](https://cloud.r-project.org/web/packages/googleVis/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
+ JSON 데이타 : jsonlite [jsonlite](https://cloud.r-project.org/web/packages/jsonlite/index.html){: .btn.btn--inverse.btn--narrow target="_blank" }
{: .notice}


설치된 패키지는 패키지창에서 사용법 및 설명을 확인 할 수 있다.

![패키지 사용법]({{ site.baseurl }}/assets/images/post/data/data-r02-30.png){: style="width:600px" .image_box} 

## 3. 패키지 설치와 로드

R은 필요한 함수를 패키지 단위로 직접 설치하여 사용할 수 있도록 기능을 제공한다.

```python
# ggplots : 데이터 시각화 패키지
# ggplots 설치
install.packages("ggplot2")

# ggplots 로드
library(ggplot2)
```

## 4. 기본 제공 패키지 사용법

R의 base, datasets, graphics 등 기본 패키지에서 제공하는 데이터 및 함수는 별도의 작업없이 바로 호출하여 사용할 수 있다.  

> **R 기본제공 데이터 및 함수**
+ cars, trees : R(datasets)에서 기본 제공하는 데이터
+ summary() : R(base)에서 기본 제공하는 결과 요약 함수
+ plot() : R(base)에서 기본 제공하는 시각화 함수
+ abline() : R(graphics)에서 기본 제공하는 라인 시각화 함수
{: .notice}

### 4-1. 데이터 사용하기
```python
# 데이터 확인
cars
trees
```
![cars]({{ site.baseurl }}/assets/images/post/data/data-r02-40.png){: style="width:400px" .image_box} 


### 4-2. 함수 사용하기

```python
# summary() 사용법 : summary(object, ...)
summary(cars)
summary(trees)
```
![summary]({{ site.baseurl }}/assets/images/post/data/data-r02-41.png){: style="width:400px" .image_box} 

### 4-3. 산점도 그리기

```python
# 산점도 plot() 사용법 : plot(data, pch=(점모양:1~25), cex=(점크기배수), col=(색상:RGB값))
plot(cars)
plot(cars, pch=20, cex=0.5)
```
![plot]({{ site.baseurl }}/assets/images/post/data/data-r02-42.png){: style="width:400px" .image_box} 
![plot]({{ site.baseurl }}/assets/images/post/data/data-r02-43.png){: style="width:400px" .image_box} 


### 4-4. 산점도 내 라인 추가해서 그리기

```python
# lm() : 선형회귀분석 함수
# lm() 사용법 : lm(formula, data) = lm(종속변수~독립변수, data)
lm.cars <- lm(dist~speed, cars)
lm.cars
abline(lm.cars, col="blue")
```

![abline]({{ site.baseurl }}/assets/images/post/data/data-r02-44.png){: style="width:400px" .image_box} 










  

      



