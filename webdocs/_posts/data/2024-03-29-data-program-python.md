---
title: "데이타 분석 프로그램 파이썬"
categories: 
  - data
tags:
  - data
  - phython
header:
  teaser: /assets/images/post/data/data-program-phy-01.png  
---

## 파이썬?
**파이썬**은 인터프리터를 사용하는 객체지향 언어이자 플랫폼에 독립적인 동적 타이핑 대화형 언어로 간결하고 읽기 쉬운 문법으로 데이터 분석, 웹개발, 인공지능 등 다양 분야에서 활용된다.


## 파이썬과 C 문법
파이썬 문법의 특징은 블록 구조에 { } 아닌 들여쓰기를 이용한다.

+ python
``` python
  // 파이썬
  def factorial(x)
    if x == 0:
      return 1
    else:
      return x * factorial(x-1)
```
+ c
``` c
  // C
  int factorial(int x) {
    if(x == 0) {
      return 1;
    } else {
      return x * factorial(x-1);
    }
  }
```

## 파이썬의 자료형

| 자료형 | 자료형 | 예시 | 설명 |
| :--: | :--: | :-- | :-- |
| 숫자정수	| int	 | 0, 1, 10,  -20	| 음의정수, 0, 양의정수 | 
| 숫자실수 | float	 | 0.2, 3.14. -35.012 | 부동소수점수 | 
| 문자열 | str | 'hello', '안녕하세요'	 | 텍스트를 다루는 자료형으로 ' 나 "의 쌍으로 표현  | 
| 바이트 | bytes | bytes([119,115,107,105]) | -  | 
| 논리형 | boolean | True, False	 | -  | 
| 리스트 | list | [1, '홍길동', 'hong@mail.com', 32] | 데이터의 목록을 다루며 대괄호[] 사이에 데이터 표기 | 
| 튜플 | tuple | ('apple','cherry', 'grape') | -  | 
| 딕셔너리 | dict | {'red':'apple', 'yellow':'바나나'} | 키-값으로 구성된 데이터 | 
| 집합 | set |  {4, 'string', True}	 | 순서가 정해지지 않는 집합 | 

## 아나콘다?
Python 및 R 언어의 패키지 의존성 관리 및 배포를 편리하게 해 주는 패키지 관리 프로그램으로 데이터 분석이나 머신러닝에 필요한 여러 패키지가 기본적으로 포함되고, 가상환경을 만들어 패키지를 독립적으로 관리하여 각 패키지의 의존성 문제를 줄여준다. 

### 1. 아나콘다 사이트 접속
> [https://www.anaconda.com/download](https://www.anaconda.com/download)

### 2. 아나콘다 설치
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-02.png){: style="width:350px" .image_box} 

### 3. 아나콘다 설치확인
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-03.png){: style="width:350px" .image_box} 

### 4. 파이썬 설치확인
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-04.png){: style="width:350px" .image_box} 

### 5. 파이썬 실행
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-05.png){: style="width:600px" .image_box} 


## Spyder?
아나콘다 설치 시 함께 설치되는 Python 통합개발환경 (= 이클립스, VSCode . . .) 으로 아나콘다 배포판에 포함되어 있는 IDE 이다.


### 1. Spyder 화면구성
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-01.png){: style="width:600px" .image_box} 

### 2. Spyder 에서 파이썬 명령어 실행
1. 왼쪽 소스창에 명령어 입력
2. [RUN] 버튼, F5 단축키, Ctrl+Enter 로 명령어 실행
3. 오른쪽 아래 콘솔창으로 결과 확인
{: .notice} 

![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-06.png){: style="width:600px" .image_box}

---
## Reference    
+ [위키백과](https://ko.wikipedia.org/wiki/%ED%8C%8C%EC%9D%B4%EC%8D%AC){: target="_blank" }





  

      



