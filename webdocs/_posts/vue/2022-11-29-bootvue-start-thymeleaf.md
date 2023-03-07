---
title: "Thymeleaf - 영화 오픈 API를 이용하여 영화정보 사이트 만들기"
categories: 
  - vue
  - springboot
tags:
  - vue
  - springboot
---

영화진흥위원회의 오픈 API (주말 박스오피스) 를 이용하여 영화정보 사이트를 만들어보자.        
[[영화진흥위원회 오픈 API 박스오피스 바로가기]](https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do){: .btn.btn--info.btn--narrow target="_blank" }  (https://www.kobis.or.kr/)    

## 박스오피스 UI
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_01.png){: style="width:800px" .image_box }

## 구현 기능
+ **오픈 API를 이용하여 Html, Jsp, Vue 방식으로 박스오피스 기능을 각각 구현해본다.**    

1. REST API 로 영화진흥원 영화 오픈API 데이타 전달 (SpringBoot RestController)    
2. **Thymeleaf Html 박스오피스 (SpringBoot + Thymeleaf)**    
3. Jsp 박스오피스 (SpringBoot + jsp)    
4. Vue 박스오피스 (Vue)       
{: .notice--info}

## 박스오피스 기능 구조도
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_02.png){: style="width:800px" .image_box }  

## 1. 박스오피스 html 작성
> + /html/boxoffice -> controller -> thymeleaf -> /templates/html/boxoffice.html 과정을 거친다.
> + controller에서 전달하는 targetDt 값을 html에서 출력한다.

### @/templates/html/boxoffice.html
```html
  <div class="header">    
    <form name="frm" method="post">
      <div id="navbar" class="navbar">
        <a href="javascript:void(0)" >영화</a>
        <a href="#" class="active">박스오피스</a>
        <a href="movieList">현재상영작</a>
        <!-- controller에서 전달받은 targetDt(기준일)를 출력한다. -->
        <p style="text-align:right"><input type="date" name="targetDt" th:value="${targetDt}" onchange="getMovieList()"></p>
      </div> 
    </form>       
  </div>   

  <!-- MAIN : START -->
  <div class="content-container"> 
    <p><span class="h2">박스오피스 &nbsp;&nbsp;</span> (<span th:text="${targetDt}"></span>일 기준)</p>
    <div class="row">
      <!-- Rest API로 전달받은 박스오피스 데이타를 출력한다. -->
      <div id="movieList" name="movieList"></div>
    </div>  
  </div>
  <!-- MAIN : END -->

<script src="/assets/js/jquery.js" type="text/javascript"></script>
<script src="/assets/js/jquery.form.min.js" type="text/javascript"></script>
<script type="text/javascript">
  jQuery(document).ready(function() {
    getMovieList();  
  }); 
  
  function getMovieList() {
    $.ajax({
        url: "/rest/boxoffice/list?targetDt="+frm.targetDt.value,            
        success: function(result){
            
          if(result != null && result.length > 20) {
            var jsonObj = JSON.parse(result);
            
            for(var i=0; i<jsonObj.boxOfficeResult.dailyBoxOfficeList.length; i++) {
              appendImage(
                jsonObj.boxOfficeResult.dailyBoxOfficeList[i].rank, 
                jsonObj.boxOfficeResult.dailyBoxOfficeList[i].movieNm, 
                jsonObj.boxOfficeResult.dailyBoxOfficeList[i].movieCd, 
                jsonObj.boxOfficeResult.dailyBoxOfficeList[i].openDt
              );
              }
          }
        },
        timeout: 2000 // sets timeout to 2 seconds
    });  
  } 
  
  function appendImage(rank, movieNm, movieCd, openDt) {
    var appendStr = "";     
    appendStr += "<div class=\"column nature\">";
    appendStr +=     "<div class=\"content\">";
    appendStr +=       "<img src=\"/assets/images/movie/"+movieCd+".jpg\" style=\"width:300px;  height:400px; \" onError=\"this.src='/assets/images/main/no_image_poster.jpg'\">";
    appendStr +=       "<div><span class=\"h4\">["+rank+" 위]"+movieNm+"</span><br/>";
    appendStr +=       "개봉일:"+openDt+"</div>";
    appendStr +=     "</div>";
    appendStr +=      "</div>"; 
    $("#movieList").html( $("#movieList").html() + appendStr);     
  }    
</script>
```

## 2. Controller 작성
> + /html/boxoffice 호출 시 thymeleaf를 거쳐 html view 
> + /jsp/boxoffice 호출 시 jsp view 

### @TestViewController.java
```java
@Controller
public class ViewTestController {

	@GetMapping("/html/boxoffice")  				
	public String movieBoxoffice(Model model) { 
		model.addAttribute("targetDt", "2022-11-01");
		return "html/boxoffice"; 
	}

	@GetMapping("/jsp/boxoffice")  				
	public String movieBoxofficeJsp(Model model) { 
		model.addAttribute("targetDt", "2022-11-01");
		return "boxoffice"; 
	}
}
```
## 3. 스프링부트 서버 확인
> + 스프링부트 접속 (http://localhost:8007/html/boxoffice)    
> + /html/boxoffice -> controller -> thymeleaf -> /templates/html/boxoffice.html    

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_03.png){: style="width:800px" .image_box }

--- 

> 영화진흥위원회의 오픈 API를 이용하여 영화정보 사이트 구현한  본 예제에 사용된 영화 이미지에 대한 저작권은 
> 아래 각 영화에 있으며, 출처는 네이버영화 입니다.

+ 영화명 : <자백> 포스터 , 출처 : 네이버영화 
+ 영화명 : <리멤버> 포스터 , 출처 : 네이버영화
+ 영화명 : <블랙아담> 포스터 , 출처 : 네이버영화  
+ 영화명 : <인생은아름다워> 포스터 , 출처 : 네이버영화   
+ 영화명 : <공조> 포스터 , 출처 : 네이버영화  
+ 영화명 : <짱구는못말려> 포스터 , 출처 : 네이버영화  
{: .notice}
   
