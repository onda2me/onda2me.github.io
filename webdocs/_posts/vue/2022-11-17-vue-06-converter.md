---
title: "Vue2 에서 단위를 변환하는 함수를 구현한 예제"
sidebar:
  nav: "docs_vue"
categories: 
  - vue
tags:
  - vue
---

Vue2 에서 cm -> inch로 in -> cm로 단위를 변환하는 함수를 선언하여 구현한 예제    

> 1 cm -> 2.54 inch이고, 1 inch -> 약 0.3937 cm  이므로    
이 값을 기준으로 숫자를 입력하고, 변환하기 버튼을 누르면 다른 단위로 변환하는 예제이다.

### 1. Vue 파일 만들기    

+ 프로젝트폴더> src> components> ConverterUnit.vue 파일을 생성한다.    


```vue
// @ConverterUnit.vue
<script>
    export default {
        data() {
            return {
                constc: 2.54, consti: 0.3937,
                cm: 1, inch: 0.3937
            }
        },  
        methods: {
            toIn() {
                this.inch = this.cm * this.consti                
            },
            toCm() {              
                this.cm = this.inch * this.constc
            }            
        }
    }    
</script>
    
<template> 
    <div>        
        <input type="number" v-model="cm" />&nbsp;     
        <button @click="toIn">cm --&gt; inch</button>&nbsp;       
        <button @click="toCm">cm &lt;-- inch</button>&nbsp;
        <input type="number" v-model="inch" />
    </div>   
</template>>
```

### 2. App.vue 파일 내용 수정하기

+ 프로젝트폴더> src> App.vue 파일 내용을 수정한다.    

```vue
// @App.vue
<template>
  <div id="app">
     <SampleApp></SampleApp>
  </div>
</template>

<script>
<!-- App.vue의 컴포넌트 위치를 지정하는 부분만 수정한다. -->
import SampleApp from './components/ConverterUnit.vue'

export default {
  name: 'App',
  components: {
    SampleApp 
  }
}
</script>

<style>
#app {
  text-align: center;
  color: #09045f;
  margin-top: 60px;
}
</style>
```

### 3. Vue 프로젝트 실행하기
> npm run serve
{: .notice--primary}

![]({{ site.baseurl }}/assets/images/post/vue/first_06.png){: style="width:500px"}    



    