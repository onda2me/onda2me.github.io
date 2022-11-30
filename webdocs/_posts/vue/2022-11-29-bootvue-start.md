---
title: "영화 오픈 API를 이용하여 영화정보 사이트 만들기"
categories: 
  - vue
tags:
  - vue
  - springboot
---

영화진흥위원회의 오픈 API (주말 박스오피스) 를 이용하여 영화정보 사이트를 만들어보자.        
 [[영화진흥위원회 오픈 API 박스오피스 바로가기]](https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do){: .btn.btn--info.btn--narrow target="_blank" }  (https://www.kobis.or.kr/)    
 오픈 API 중 박스오피스 API를 이용하여 Html, Jsp, Vue 각 3가지 방식으로 박스오피스 기능을 구현해 본다.    


## 구현할 기능
1. Thymeleaf 박스오피스 (SpringBoot + Thymeleaf)    
2. Jsp 박스오피스 (SpringBoot + jsp)    
3. Vue 박스오피스 (Vue)    
4. 박스오피스 API (SpringBoot RestController)       
{: .notice--info}

## 박스오피스 UI
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_01.png){: style="width:800px" .image_box }

## 박스오피스 기능 구조도
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_02.png){: style="width:800px" .image_box }


## 1. 박스오피스 Rest API 작성
> 영화진흥위원회의 오픈 API 데이타를 각 서비스로 전달해 주는 Rest API 구현    
> Rest API를 별도로 구현하지 않고, 영화진흥위원회의 오픈 API로 직접 구현도 가능하다.

### @MovieKobisAPIController.java
```java
@RestController
public class MovieKobisAPIController {

  @GetMapping("/rest/boxoffice/list")
  public String boxoffice_list(@RequestParam Map<String, String> searchMap) throws Exception {      
    String responseStr = null;
    try {
      //------------------------------------------------------
      //  검색조건 설정
      //------------------------------------------------------      
      searchMap.put("key", "my_api_key");
      searchMap.put("multiMovieYn", "N");
      searchMap.put("weekGb", "0");

      // 예제로 작성한 박스오피스의 이미지가 22년11월1일 기준으로 세팅되어 있다.
      // 포스터 이미지가 없는 경우 no_image로 대체하여 보여줄 예정.
      if(StringUtil.equals(searchMap.get("targetDt"), "")) {
        searchMap.put("targetDt", "20221101");
      } else {
        searchMap.put("targetDt", searchMap.get("targetDt").replaceAll("-", ""));
      }
      
      responseStr = getMovieHttp("/boxoffice/searchDailyBoxOfficeList.json?")
                .getGetRequest("text/json", searchMap);
      
    } catch (Exception ex) {
      ex.printStackTrace();
    }  finally {

    }        
 
    return responseStr;
  }
}
```    

## 2. 박스오피스 html 작성
### @/templates/html/boxoffice.html
```html
  <div class="header">    
    <form name="frm" method="post">
      <div id="navbar" class="navbar">
        <a href="javascript:void(0)" >영화</a>
        <a href="#" class="active">박스오피스</a>
        <a href="movieList">현재상영작</a>
        <p style="text-align:right"><input type="date" name="targetDt" th:value="${targetDt}" onchange="getMovieList()"></p>
      </div> 
    </form>       
  </div>   

  <!-- MAIN (Center website) -->
  <div class="content-container"> 
    <p><span class="h2">박스오피스 &nbsp;&nbsp;</span> (<span th:text="${targetDt}"></span>일 기준)</p>
    <div class="row">
      <div id="movieList" name="movieList">                       
      </div>
    </div>  
  </div>
  <!-- END MAIN -->

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

## 3. Controller 작성
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
## 4. 스프링부트 서버 확인
> 스프링부트 접속 (http://localhost:8007/html/boxoffice)    
> /html/boxoffice -> controller -> thymeleaf -> /templates/html/boxoffice.html    

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_03.png){: style="width:800px" .image_box }




---   
   
