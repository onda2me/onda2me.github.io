---
title:  "이클립스에서 javadoc 만들기"
header:
  #teaser: "/assets/images/500x300.png"
categories: 
  - eclipse

---
javadoc은 java 프로그램 소스의 설명서로, 개발된 프로그램 분석 
(프로젝트의 패키지 구성, 클래스 목록 및 기능, 사용되는 함수의 용도 등)을 위해 소스를 확인하지 않아도
각 클래스의 기능을 html 문서로 구성하여 웹사이트 처럼 편리하게 확인이 가능한 문서이다.
javadoc은 문서로 직접 작업하는 것이 아니라 해당 소스내에 작성된 주석을 이용하여 설명서를 자동으로 생성할 수 있다.  
이 글은 이클립스에서 javadoc 생성 기능을 이용하여 프로그램 설명서를 작성하는 방법에 대해 설명한다.  

#### 1. javadoc 생성을 위한 주석 작성법

```bash
// 클래스, 변수등에 대한 주석 작성법  
/**  
  설명하고자 하는 내용 작성  
*/  

// 메소스에 대한 주석 작성법  
/**  
* 메소드에 대한 설명  
* @param [변수타입] 변수 설명  
* @return [반환타입] 반환값에 대한 설명  
*/  

// 메소드 주석 작성예  
/**  
 * 게시글번호로 게시글정보 조회  
 *  
 * @param seq int 게시글번호  
 * @return BoardVo 게시글정보  
 */  
public BoardVo select(int seq);  
```

#### 2. javadoc 생성결과  

![]({{ site.baseurl }}/assets/images/post/javadoc_desc.png){: style="width:350px"}

> **방법1.** 메뉴 > File > Export > Java > Javadoc  

![]({{ site.baseurl }}/assets/images/post/javadoc_01.png)  

  
> **방법2.** 메뉴 > Project > Generate Javadoc  

![]({{ site.baseurl }}/assets/images/post/javadoc_02.png)    
    
    
    

> **Trouble Shooting:** 실행오류  
 `+` 소스의 인코딩이 UTF-8이나 다른 캐릭터셋으로 작성되어 발생하는 오류

![]({{ site.baseurl }}/assets/images/post/javadoc_04.png)    


> **Trouble Shooting:** 해결방법  
 `+` Javadoc 생성시 VM options (-encoding UTF-8 -charset UTF-8 -docencoding UTF-8) 을 추가한다  

![]({{ site.baseurl }}/assets/images/post/javadoc_03.png)
