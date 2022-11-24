---
title: "Vue 프로젝트 폴더를 기능별로 구분하기 "
sidebar:
  nav: "docs_vue"
categories: 
  - vue
tags:
  - vue
---

Vue Router를 이용하여 컴포넌트를 분리하여 웹페이지를 만들어 보자.    

+ Vue 프로젝트 폴더를 기능별로 구분하기    

```
vuex3                          # Vue 프로젝트 ROOT
|
├── src                        # 개발소스 
|   ├── App.vue                # 최상위 컴포넌트      
|   ├── main.js                # 어플리케이션 진입점. 최상위 컴포넌트인 App.vue를 로드
|   ├── components             # 각 웹페이지의 화면을 구성할 컴포넌트 저장위치
|   |   ├── common             # List.vue, Button.vue 등 어플리케이션에 공통으로 사용할 컴포넌트
|   |   ├── layouts            # Header.vue, Footer.vue 등 화면 레이아웃을 구성할 컴포넌트
|   |   └── HelloWorld.vue     
|   ├── routes                 # router 설정파일 저장위치 
|   |   ├── index.js
|   |   └── routes.js          
|   ├── views                  # router를 통해서 구성할 컴포넌트 저장위치 (추가됨)
|   |   ├── sign
|   |   ├── home
|   |   |   ├── HomeView.vue       
|   |   ├── posts
|   |   |   └── PostView.vue   
|   |   ├── abouts
|   |   |   └── AboutView.vue      # about 컴포넌트 
    . . . 
|   ├── assets                 # css, image, icon 등  정적자원 저장위치
|   |   ├── css   
|   |   └── images
|   └── main.js                # 어플리케이션 진입점으로 최상위 컴포넌트인 App.vue를 로드
```



















