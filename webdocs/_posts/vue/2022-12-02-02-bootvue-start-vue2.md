---
title: "Vue+RestAPI - 영화 오픈 API를 이용하여 영화정보 사이트 만들기"
categories: 
  - vue
tags:
  - vue
  - springboot
---

영화진흥위원회의 오픈 API (주말 박스오피스) 를 이용하여 영화정보 사이트를 만들어보자.        
[[영화진흥위원회 오픈 API 박스오피스 바로가기]](https://www.kobis.or.kr/kobisopenapi/homepg/apiservice/searchServiceInfo.do){: .btn.btn--info.btn--narrow target="_blank" }  (https://www.kobis.or.kr/)    

## 구현 기능
+ **오픈 API를 이용하여 Html, Jsp, Vue 방식으로 박스오피스 기능을 각각 구현해본다.**    

> Vue에서의 Ajax 통신이 문법과 이미지처리 등 한 단계로 진행하기에 무리가 있어    
> **Vue+JsonFile**, **Vue+RestAPI** 두 단계로 분리하여 예제 진행
{: .notice--primary}

1. REST API 로 영화진흥원 영화 오픈API 데이타 전달 (SpringBoot RestController)    
2. Thymeleaf Html 박스오피스 (SpringBoot + Thymeleaf)    
3. Jsp 박스오피스 (SpringBoot + jsp)    
4. Vue 박스오피스 (Vue + JsonFile)          
5. **Vue 박스오피스 (Vue + RestAPI)**       
{: .notice--info}

## 박스오피스 기능 구조도
![]({{ site.baseurl }}/assets/images/post/vue/boot_start_02.png){: style="width:800px" .image_box }  

## 1. router 경로 추가
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

## 2. 박스오피스 Vue 작성
> + Rest API와 연동할 Vue 컴포넌트

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

### @/views/movie/MovieBoxoffice.vue
```vue
<template>
<div class="content-container">

  <p class="padding-md"><span class="h2">박스오피스 RestAPI&nbsp;&nbsp;</span> 
    <input type="date" v-model="targetDt" > 일 기준 <!-- 박스오피스 기준일 출력  -->
  </p>
  <div class="row">
    <div id="movieList" name="movieList" >

      <!-- 박스오피스 리스트 출력 -->
      <div class="column show" v-for="item in movies.dailyBoxOfficeList" :key="item.rank">
        <div class="content">
          <!-- 
              getPoster : SpringBoot 서버의 이미지 경로 return
              getPosterDefault : 영화의 이미지가 없는 경우 보여줄 Default 이미지
          -->        
          <img :src="getPoster(item.movieCd)" @error="getPosterDefault" class="poster"> 
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
  /* 
  # 참고 예제  :
    https://vuejs.org/examples/#flight-booker 
    https://vuejs.org/examples/#fetching-data
  */
  function stringToDateFormat(str) {
    return str.substr(0, 4) +'-'+ str.substr(4, 2) + '-'+str.substr(6, 2)
  } 

  export default {
    data() {
      return {
        clickCount: 0,  
        bootServer: process.env.VUE_APP_BASE_HOST,
        movies: {},
        targetDt: '2022-11-02',
        //targetDt: dateToString(new Date())
        posterPath: process.env.VUE_APP_BASE_HOST +'/assets/images/movie/',
        posterDefault: 'no_image_poster.jpg'
      }
    },                  
    mounted() {      // Rest API (Ajax) 연동 시
    // created() {   // Data File 연동 시       
        this.fetchData()        
    }, 
    watch: {        // targetDt 데이타 변경 감시
      targetDt: 'fetchData'
    }, 
    methods: {  
      async fetchData() {
        var json = null
        const res = await fetch(
          this.bootServer+'/rest/boxoffice/list?targetDt='+this.targetDt
        )
        json = await res.json()
        this.movies = json.boxOfficeResult
        this.targetDt = stringToDateFormat(this.movies.showRange)
      },
      getPosterDefault(e) {          
        e.target.src = this.posterPath + this.posterDefault
      }, 
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

## 3. Vue 서버에서 확인
> + Vue 서버 접속 (http://localhost:8080/movie/boxoffice)  
> + Vue는 8080 에서 이미지는 springboot(8007) 에서 서비스    

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_12.png){: style="width:800px" .image_box }


## 4. Vue Build 후 스프링부트 서버에서 확인
> + SpringBoot 서버 접속 (http://localhost:8007/movie/boxoffice)  
> + Vue와 이미지는 모두 springboot(8007) 에서 서비스    

![]({{ site.baseurl }}/assets/images/post/vue/boot_start_121.png){: style="width:800px" .image_box }


## 참고. Vue 실행오류
> + 이 Vue 예제는 공부하면서 작성한 것으로 최적화 되지 않았습니다.    
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
   
