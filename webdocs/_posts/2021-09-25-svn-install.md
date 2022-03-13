---
title: "SVN서버 및 클라이언트 프로그램 설치"
header:
categories: 
  - svn
tags:
  - svn
---

IT관련 회사가 아니라 프로그램을 혼자 담당하고 있지만, 소스의 버전관리가 필요하기에 SVN을 설치하였다.  
서버는 무료버전인 Visual SVN을 설치했고, 
클라이언트 프로그램은 윈도우 탐색기에서 바로 사용 가능한 Totorise와 이클립스용 subclipse 4.3.0을 설치하였다.  
이 글은 이 프로그램의 설치 과정에 대한 글이다.  

---

#### 1.SVN 서버 다운로드 및 설치
VisualSVN Server 다운로드 : [https://www.visualsvn.com/](https://www.visualsvn.com/)     
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_server.png){: style="width:500px"}


#### 2. SVN 서버 실행하기

윈도우 > 프로그램 > VisualSVN > VisualSVN Server Manager  
SVN 접속을 위한 계정 추가  
  + User > Create User > Name / Password 설정    
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_server_run.png)
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_server_run2.png)

#### 3. SVN 접속을 위한 클라이언트 프로그램

##### 3-1. 이클립스용 플러그인  
  

  + 이클립스 Marketplace 에서 svn 검색  
    (Help > Eclipse Marketplace > svn)    
    ![]({{ site.baseurl }}/assets/images/post/sw/svn_eclipse.png){: style="width:500px"}

  + 저장소 정보보기  
  Window > Show view > Other > SVN > SVN Repositories    
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_eclipse1.png){: style="width:400px"}

  + 저장소 추가    
  화면에서 오른쪽 마우스버튼 클릭 후 New > Repositories location    
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_eclipse4.png){: style="width:400px"}

  + 프로젝트 공유    
  Project > Team > Share Project    
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_eclipse2.png){: style="width:400px"}

##### 3-2. 윈도우 탐색기에서 바로 사용시 Totorise 설치
  
 + Totorise 다운로드    
   [https://tortoisesvn.net/downloads.html](https://tortoisesvn.net/downloads.html)     
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_tortoise.png){: style="width:500px"}

 + 저장소 추가    
  (윈도우 탐색기 > 오른쪽 마우스 > TotoiseSVN > Repo-browser)
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_tortoise2.png){: style="width:500px"} 

+ 저장소 주소 입력    
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_tortoise3.png){: style="width:500px"} 

+ 저장소 추가 완료    
  윈도우 탐색기 > 오른쪽 마우스 > TotoiseSVN  메뉴가 추가되었다.    
  ![]({{ site.baseurl }}/assets/images/post/sw/svn_tortoise4.png){: style="width:500px"}   