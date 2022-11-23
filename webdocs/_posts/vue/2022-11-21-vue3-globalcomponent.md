---
title: "Header와 Footer 영역을 전역 컴포넌트로 분리하기"
sidebar:
  nav: "docs_vue"
categories: 
  - vue
tags:
  - vue
  - router
---

Vue 어플리케이션에서 공통으로 사용되는 Header와 Footer를 전역 컴포넌트로 분리해보자.   

![]({{ site.baseurl }}/assets/images/post/vue/vue3_router_11.png){: style="width:700px"}

+ Vue 어플리케이션 구조    

```
vuex3                             # Vue 프로젝트 ROOT
|
├── src                           
|   ├── components                
|   |   ├── layout                # Layout용 컴포넌트 저장위치 (* 추가)
|   |   |   └── LayoutNavi.vue    # Navigation 영역 (* 추가)
|   |   |   └── LayoutFooter.vue  # Footer 영역  (* 추가)
|   ├── router                    
|   |   └── index.js              # URL와 컴포넌트 router 설정 파일  (* 수정)
|   ├── views                     
|   |   ├── AboutView.vue         # about 컴포넌트 
|   |   ├── PostsView.vue         # posts 컴포넌트 
|   |   └── HomeView.vue          # home 컴포넌트 
|   ├── App.vue                   # 최상위 컴포넌트  (* 수정)
|   └── main.js                   

```

## 1) LayoutNavi.vue 파일 추가
```vue
<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/posts">Posts</router-link> | 
    <router-link to="/about">About</router-link>
  </nav>
</template>

<style>
nav {
  padding: 30px;
  background-color: #f1f1f1;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
```

## 2) LayoutFooter.vue 파일 추가
```vue
<template>
  <footer>© 2022 onda2me by global component</footer> 
</template>

<style>
footer {
  padding: 20px;
  background-color: #cdcdcd;
}
</style>
```

## 3) App.vue 파일 수정
```vue
<template>
  <div id="app">
    <LayoutNavi />
    <div class="contents">
      <router-view />
    </div>
    <LayoutFooter />
  </div>
</template>

<script> 
import LayoutNavi   from '@/components/layout/LayoutNavi.vue'
import LayoutFooter from '@/components/layout/LayoutFooter.vue'

export default {
  name: 'App',
  components: {
    LayoutNavi,
    LayoutFooter
  }
} 
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.contents {
  padding: 20px 10px;
}
</style>
```

## 4) posts 페이지에 접속하여 확인하기

![]({{ site.baseurl }}/assets/images/post/vue/vue3_component.png){: style="width:700px" .image_box}

---   
   
   
본 글에서 설명한 Vue 코드는 [[GitHub 바로가기]](https://github.com/onda2me/vuex3_basic_example){: .btn.btn--info.btn--narrow target="_blank" } 에서 다운받을 수 있습니다.