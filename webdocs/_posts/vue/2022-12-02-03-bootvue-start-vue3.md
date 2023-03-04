---
title: "Vue+RestAPI+JQuery - 영화 오픈 API를 이용하여 영화정보 사이트 만들기"
categories: 
  - vue
  - springboot
tags:
  - vue
  - springboot
header:
  teaser: /assets/images/post/vue/boot_start_02.png  
---

영화진흥위원회의 오픈 API (주말 박스오피스) 를 이용하여 영화정보 사이트를 만들어보자.        
[[영화진흥위원회 오픈 API 박스오피스 바로가기]](https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do){: .btn.btn--info.btn--narrow target="_blank" }  (https://www.kobis.or.kr/)    

## 구현 기능
+ **오픈 API를 이용하여 Html, Jsp, Vue 방식으로 박스오피스 기능을 각각 구현해본다.**    

> Vue에서의 Ajax 통신이 문법과 이미지처리 등 한 단계로 진행하기에 무리가 있어    
> **Vue+JsonFile**, **Vue+RestAPI**, **Vue+RestAPI+JQuery** 세 단계로 분리하여 예제 진행
{: .notice--primary}

1. REST API 로 영화진흥원 영화 오픈API 데이타 전달 (SpringBoot RestController)    
2. Thymeleaf Html 박스오피스 (SpringBoot + Thymeleaf)    
3. Jsp 박스오피스 (SpringBoot + jsp)    
4. Vue 박스오피스 (Vue + JsonFile)          
5. Vue 박스오피스 (Vue + RestAPI)         
6. **Vue 박스오피스 (Vue + RestAPI + JQuery)**       
{: .notice--info}

## 박스오피스 기능 구조도
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_02.png){: style="width:800px" .image_box }  

## 1. Vue에 JQuery 기능 추가
> JQuery를 이용한 방식은 Vue로만 데이터를 처리하는 것 보다 과정이 어렵다.    
> 실무에서는 Vue로 처리하고, 이 예제는 참고만 하는 게 좋을 것 같다.
{: .notice--info}

### jquery 설치
> npm install jquery
{: .notice--primary}

![]({{ site.baseurl }}/assets/images/post/vue/boot_vue_jquery.png){: style="width:650px" .image_box }  
## 2. router 경로 추가
> + JsonFile 연동 Path:  /movie/boxofficeFile
> + RestAPI 연동 Path:  /movie/boxoffice
> + RestAPI+JQuery 연동 Path:  /movie/boxofficeJQuery

### @/router/index.js
```js
  {
    path: '/movie/boxoffice',
    name: 'movieBoxoffice',
    component: () => import('../views/movie/MovieBoxoffice.vue')
  },
  {
    path: '/movie/boxofficeFile',
    name: 'movieBoxofficeFile',
    component: () => import('../views/movie/MovieBoxofficeFile.vue')
  },
  {
    path: '/movie/boxofficeJquery',
    name: 'movieBoxofficeJqeury',
    component: () => import('../views/movie/MovieBoxofficeJquery.vue')
  },
```

## 3. 박스오피스 Vue 작성
> + Rest API와 JQuery로 연동할 Vue 컴포넌트
> + Jquery를 사용할 Vue 파일에 jquery import 하기

### @/views/movie/MovieBoxofficeJquery.vue
```vue
<template>

<div class="main-container">
  <div class="content-container"> 

    <p class="padding-md"><span class="h2">박스오피스 JQuery&nbsp;&nbsp;</span> 
      <input type="date" v-model="targetDt" > 일 기준 <!-- 박스오피스 기준일 출력  -->
    </p>
    <div class="row">        
      <div id="movieList" name="movieList" ></div>
      <div id="imageTmp" ></div> <!-- //이미지 생성용 임시 div box -->
    </div>
  </div>
</div>  

</template> 

<script>
  // jquery 사용 등록하기
  import $ from 'jquery'

  export default {
    data() {
      return {        
        //movies: {}, // div에 바로 출력
        targetDt: '2022-11-02',
        bootServer: process.env.VUE_APP_BASE_HOST,
        posterPath: process.env.VUE_APP_BASE_HOST +'/assets/images/movie/',
        //posterDefault: 'no_image_poster.jpg'
      }
    },          
    mounted() {        
      getMovieListAPI(this.bootServer, this.posterPath, this.targetDt, this.posterDefault)
    }, 
    watch: {        // targetDt 데이타 변경 감시
      targetDt: 'fetchData'
    },
    methods: {  
      async fetchData() {
        getMovieListAPI(this.bootServer, this.posterPath, this.targetDt, this.posterDefault)        
      }, /* Jquery로 div에 직접 출력하여 사용안함
      getPosterDefault(e) {          
        e.target.src = this.posterPath + this.posterDefault
      }, 
      getPoster(movieCd) {
        return this.posterPath + movieCd +'.jpg'   
      } */
    } 
  }
  function getMovieListAPI(bootServer, posterPath, targetDt, posterDefault) {

    $.ajax({
      url: bootServer + "/rest/boxoffice/list?targetDt="+targetDt,    
      error: function(error) {
        console.log("getMovieListAPI.error : " + error); 
      },        
      success: function(result){
          
        if(result != null && result.length > 20) {
          var jsonObj = JSON.parse(result);
          $("#movieList").html("");

          for(var i=0; i <6; i++) { 
            appendMovieInfo(
                  posterPath,
                  posterDefault,
                  jsonObj.boxOfficeResult.dailyBoxOfficeList[i].rank, 
                  jsonObj.boxOfficeResult.dailyBoxOfficeList[i].movieNm, 
                  jsonObj.boxOfficeResult.dailyBoxOfficeList[i].movieCd, 
                  jsonObj.boxOfficeResult.dailyBoxOfficeList[i].openDt, 
                  jsonObj.boxOfficeResult.dailyBoxOfficeList[i].audiAcc
            ); 
          }
          //이미지 생성용 임시 div box hidden
          $("#imageTmp").css("display", "none");
        }
      },
      timeout: 2000 // sets timeout to 2 seconds
      });  
    }  
    
    function appendMovieInfo(posterPath, posterDefault, rank, movieNm, movieCd, openDt, audiAcc) {

      // 이미지 생성
      var image = document.createElement("img");
      image.src = posterPath+movieCd+".jpg";     
      //image.onerror = "this.src='"+posterPath + posterDefault+"'"; //동작안함
      image.setAttribute('width', '300px');
      image.setAttribute('height', '400px');
      $("#imageTmp").html(image);

      // 영화정보 생성
      var appendStart = "", appendEnd = ""; 
      appendStart += "<div class=\"column show \">";
      appendStart +=     "<div class=\"content\">";

      //$(imageTmp) 로 처리
      //appendStr +=       "<img src=\"poster.jpg\" style=\"width:300px;  height:400px; \">";

      appendEnd   +=       "<div class=\"title\"><span class=\"h4\">["+rank+" 위]"+movieNm+"</span><br/><br/>";
      appendEnd   +=         "<p>개봉일: "+openDt+"<br/>누적관객수: "+audiAcc+"</p>";
      appendEnd   +=       "</div>";
      appendEnd   += "</div></div>";
      $("#movieList").html($("#movieList").html() + appendStart + $("#imageTmp").html() + appendEnd);    
    }  
</script>
```

## 4. Vue 서버에서 확인
> + Vue 서버 접속 (http://localhost:8080/movie/boxofficeJquery)  
> + Vue는 8080 에서 이미지는 springboot(8007) 에서 서비스    
> + 이미지가 없을 경우 대체이미지 처리 방법을 찾지 못함. (onerror='this.src' 작동안됨)     

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_31.png){: style="width:800px" .image_box }


## 참고. Vue 실행오류
> + 이 Vue 예제는 공부를 위한 기능구현 위주로 작성하였고, 최적화 작업은 하지 않았습니다.    
> + Vue 페이지 실행 시 아래와 같은 오류가 발생하는데, 아직 원인을 찾지 못했습니다. 
{: .notice--primary}

```text
runtime-core.esm-bundler.js?d2dd:40 [Vue warn]: Maximum recursive updates exceeded in component <App>.
This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. 
Possible sources include component template, render function, updated hook or watcher source function.
```

## 참고. SpringBoot + Vue 설정
> + [스프링부트 Jsp View 설정](http://localhost:4000/springboot/02-springboot-jsp/){: .btn.btn--info.btn--narrow target="_blank" }
> + [스프링부트 + Vue 설치](http://localhost:4000/vue/springboot-vue/){: .btn.btn--info.btn--narrow target="_blank" }
> + [스프링부트 + Vue Build](http://localhost:4000/vue/springboot-vue-build/){: .btn.btn--info.btn--narrow target="_blank" }

---   
   
