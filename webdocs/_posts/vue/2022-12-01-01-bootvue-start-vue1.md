---
title: "Vue+JsonFile - 영화 오픈 API를 이용하여 영화정보 사이트 만들기"
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
4. **Vue 박스오피스 (Vue + JsonFile)**       
5. Vue 박스오피스 (Vue + RestAPI)       
6. Vue 박스오피스 (Vue + RestAPI + JQuery)       
{: .notice--info}

## 박스오피스 기능 구조도
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_02.png){: style="width:800px" .image_box }  

## 1. 박스오피스 Json File 작성
> + 영화진흥위원회의 박스오피스 API 데이타를 Json 파일로 저장    

### @/assets/data/movies.json
```json
{"boxOfficeResult": {
    "boxofficeType":"일별 박스오피스","showRange":"20221101~20221101",
    "dailyBoxOfficeList":[
        {"rnum":"1","rank":"1","rankInten":"0","rankOldAndNew":"OLD","movieCd":"20198461","movieNm":"리멤버","openDt":"2022-10-26","salesAmt":"138755562","salesShare":"20.6","salesInten":"-37718696","salesChange":"-21.4","salesAcc":"2628611132","audiCnt":"14584","audiInten":"-4052","audiChange":"-21.7","audiAcc":"272556","scrnCnt":"1064","showCnt":"3417"}, 
        {"rnum":"2","rank":"2","rankInten":"0","rankOldAndNew":"OLD","movieCd":"20198429","movieNm":"자백","openDt":"2022-10-26","salesAmt":"261644850","salesShare":"38.9","salesInten":"-34168607","salesChange":"-11.6","salesAcc":"3045963956","audiCnt":"27235","audiInten":"-4292","audiChange":"-13.6","audiAcc":"311758","scrnCnt":"1051","showCnt":"4197"},
        {"rnum":"3","rank":"3","rankInten":"0","rankOldAndNew":"OLD","movieCd":"20198317","movieNm":"인생은 아름다워","openDt":"2022-09-28","salesAmt":"54989791","salesShare":"8.2","salesInten":"-6736500","salesChange":"-10.9","salesAcc":"10106602525","audiCnt":"6522","audiInten":"-762","audiChange":"-10.5","audiAcc":"1080344","scrnCnt":"524","showCnt":"948"},{"rnum":"4","rank":"4","rankInten":"0","rankOldAndNew":"OLD","movieCd":"20226886","movieNm":"블랙 아담","openDt":"2022-10-19","salesAmt":"100062166","salesShare":"14.9","salesInten":"-26640784","salesChange":"-21","salesAcc":"6947673571","audiCnt":"10063","audiInten":"-3108","audiChange":"-23.6","audiAcc":"672152","scrnCnt":"701","showCnt":"2047"},        
        {"rnum":"5","rank":"5","rankInten":"0","rankOldAndNew":"OLD","movieCd":"20215601","movieNm":"공조2: 인터내셔날","openDt":"2022-09-07","salesAmt":"21856091","salesShare":"3.3","salesInten":"-5791003","salesChange":"-20.9","salesAcc":"70724891052","audiCnt":"3132","audiInten":"-934","audiChange":"-23","audiAcc":"6955443","scrnCnt":"408","showCnt":"628"},        
        {"rnum":"6","rank":"6","rankInten":"0","rankOldAndNew":"OLD","movieCd":"20226777","movieNm":"극장판 짱구는 못말려: 수수께끼! 꽃피는 천하떡잎학교","openDt":"2022-09-28","salesAmt":"29135868","salesShare":"4.3","salesInten":"-2168418","salesChange":"-6.9","salesAcc":"7060990271","audiCnt":"2937","audiInten":"-211","audiChange":"-6.7","audiAcc":"704622","scrnCnt":"325","showCnt":"451"}
    ]}
}
```

## 2. router 경로 추가
> + JsonFile 연동 Path:  /movie/boxofficeFile
> + RestAPI 연동 Path:  /movie/boxoffice

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
```

## 3. 박스오피스 Vue 작성
> + Json File과 연동할 Vue 컴포넌트

> + **이미지 경로 유의점**    
> Vue와 Image 서버가 다른 경우 경로 처리가 어려우므로, 첫 개발시에는 @error 도 제거하고    
> Vue와 Image 를 같은 서버에서 상대경로로 처리하는 게 수월하다.    
> + **영화진흥위원회 영화정보 변수**    
> `-` moveCd : 영화코드    
> `-` movieNm : 영화명    
> `-` rank : 순위    
> `-` openDt : 개봉일    
> `-` audiAcc : 누적관객수    
{: .notice--primary}

### @/views/movie/MovieBoxofficeFile.vue
```vue
<template>
<div class="content-container"> 
  <p class="padding-md">
    <span class="h2">박스오피스 JsonFile&nbsp;&nbsp;</span>       
    (<span> {% raw %}{{ movies.showRange }}{% endraw %} </span> 일 기준) <!-- 데이타 text 출력  -->
  </p>
    <div class="row">
      <div id="movieList" name="movieList">

        <!-- 박스오피스 리스트 출력 -->
        <div class="column show" v-for="item in movies.dailyBoxOfficeList" :key="item.rank">
          <div class="content">
            <!-- 
              getPoster : SpringBoot 서버의 이미지 경로 return
              getPosterDefault : 영화의 이미지가 없는 경우 보여줄 Default 이미지
            -->
            <img :src="getPoster(item.movieCd)" @error="getPosterDefault" class="poster">
            <div class="text-block">img:{% raw %}{{ getPoster(item.movieCd) }}{% endraw %}</div> <!-- 이미지 경로 확인용 -->
            <div class="title">{% raw %}{% endraw %}
              <span class="h4">[{% raw %}{{ item.rank }}{% endraw %}위] {% raw %}{{ item.movieNm }}{% endraw %} </span><br/><br/>
              개봉일: {% raw %}{{ item.openDt }}{% endraw %}<br/>
              누적관객수: {% raw %}{{ item.audiAcc }}{% endraw %}
            </div>              
          </div>
        </div>

      </div>
    </div>
</div>
</template> 

<script>
  import movieList from '@/assets/data/movies.json'
  //import defaultImageSrc from '@/assets/no_image_poster.jpg'

  export default {
    data() {
      return {
        clickCount: 0,          
        movies: [],      
        // 이미지를 springboot(8007 포트) 에서 서비스 
        posterPath: process.env.VUE_APP_BASE_HOST +'/assets/images/movie/',        
        posterDefault: 'no_image_poster.jpg'         
      }
    },          
    //mounted() { // Rest API (Ajax) 연동 시
    created() {   // Data File 연동 시      
      this.movies = movieList.boxOfficeResult
    },
    methods: { 
      // 영화 이미지 없을 때 보여줄 no_image
      getPosterDefault(e) {          
        e.target.src = this.posterPath + this.posterDefault
      }, 
      // 영화 이미지 경로
      getPoster(movieCd) {
        return this.posterPath + movieCd +'.jpg'   
      } 
    } 
  }
</script> 

<style>
@import "@/assets/css/movie.css";
</style>
```

## 4. Vue 서버에서 확인
> + Vue 서버 접속 (http://localhost:8080/movie/boxofficeFile)  
> + Vue는 8080 에서 이미지는 springboot(8007) 에서 서비스    

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_10.png){: style="width:800px" .image_box }


## 5. Vue Build 후 스프링부트 서버에서 확인
> + SpringBoot 서버 접속 (http://localhost:8007/movie/boxofficeFile)  
> + Vue와 이미지는 모두 springboot(8007) 에서 서비스    

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_101.png){: style="width:800px" .image_box }


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
   
