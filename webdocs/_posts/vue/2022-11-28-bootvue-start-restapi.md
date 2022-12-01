---
title: "REST API - 영화진흥원 영화 오픈API를 이용하여 영화정보 사이트 만들기"
categories: 
  - vue
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

1. **REST API 로 영화진흥원 영화 오픈API 데이타 전달 (SpringBoot RestController)**    
2. Thymeleaf Html 박스오피스 (SpringBoot + Thymeleaf)    
3. Jsp 박스오피스 (SpringBoot + jsp)    
4. Vue 박스오피스 (Vue)       
{: .notice--info}

## 박스오피스 기능 구조도
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_02.png){: style="width:800px" .image_box }

## 1. 영화진흥원 박스오피스 오픈 API 

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_00.png){: style="width:600px" .image_box }

## 2. Rest API용 Controller 작성
> + 영화진흥위원회의 오픈 API 데이타를 각 서비스로 전달해 주는 Rest API 구현    
> + Rest API를 별도로 구현하지 않고, 영화진흥위원회의 오픈 API로 직접 구현도 가능하다.

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
      // 포스터 이미지가 없는 경우 View (Html, Jsp.. )영역에서 no_image로 대체하여 보여준다.
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

## 3. 스프링부트 서버 확인
> + 스프링부트 접속 (http://localhost:8007/rest/boxoffice/list)    
> + /rest/boxoffice/list -> controller     

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_000.png){: style="width:800px" .image_box }




---   
   
