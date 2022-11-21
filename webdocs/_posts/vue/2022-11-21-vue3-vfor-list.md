---
title: "router의 dynamic matching을 이용하여 동적 URL을 구성해 보자"
categories: 
  - vue
tags:
  - vue
  - router
---

게시글 목록 -> 게시글 상세, 사용자 목록 -> 사용자 상세 등 웹페이지 이동 시
url의 id값에 따라 페이지 내용을 동적으로 구성하는 기능을 구현하고자 한다.

**리스트의 목록 구현**     
1. 단일 컴포넌트 구현과     
2. 컴포넌트 분리 구현 두가지 방식으로 페이지를 구성하고,    

**리스트 상세 이동**은 router의 dynamic matching을 이용하여 동적 URL로 구성
1. /users/1 경로 접속 시 1번 사용자정보
2. /users/2 경로 접속 시 2번 사용자정보

+ **/users/ : 사용자 목록 페이지**      
    

![]({{ site.baseurl }}/assets/images/post/vue/vue3_vfor_list.png){: style="width:600px" .image_box }

+ **/users/{사용자id} : 사용자의 상세정보 페이지**    
    

![]({{ site.baseurl }}/assets/images/post/vue/vue3_vfor_list2.png){: style="width:600px" .image_box}

+ **변경 할 Vue 어플리케이션 구조**    

```
vuex3                               # 프로젝트 ROOT
|
├── src                           
|   ├── components                
|   ├── router                    
|   |   └── index.js                # URL와 컴포넌트 router 설정 파일  (* 수정)
|   ├── views                     
|   |   ├── user                    # user  (* 추가)
|   |   |   ├── UserListView.vue    # user list 컴포넌트    (* 추가)
|   |   |   ├── UserDetailView.vue  # user detail 컴포넌트  (* 추가)
|   |   |   └── UserItem.vue        # list item 컴포넌트    (* 추가)
|   ├── App.vue                   
|   └── main.js                   

```



## 1) router > index.js 파일 수정
```javascript
  // user 경로 추가 : start
  {
    path: '/users/',
    name: 'users',
    component: () => import('@/views/user/UserListView.vue')
  }, 
  {
    path: '/users/:id',
    name: 'user',
    component: () => import('@/views/user/UserDetailView.vue')
  }, // user 경로 추가 : end 
```

## 2) UserListView.vue 파일 추가
```vue
<template>
  <h1>User List</h1> 
  <h2>Case1. 단일 컴포넌트에서 V-for 지시문을 사용하여 List 구현</h2>
  <ul>
    <li v-for="user in users" :key="user.id">
      <a v-bind:href="'/users/'+user.id">{{ user.name}} 정보 보기</a>
    </li>
  </ul>
  
  <h2>Case2. 컴포넌트를 분리하여 List 구현</h2>
  <ul>
    <UserItem v-for="user in users" :user="user" :key="user.id"></UserItem>
  </ul>
</template>
  
<script>
import UserItem from './UserItem.vue'

export default { 
    components: {
      UserItem
    },    
    data() {
      return {
        users : [
              {id : 0, name : '0번 사용자', email : 'user0@email.com'},
              {id : 1, name : '1번 사용자', email : 'user1@email.com'},
              {id : 2, name : '2번 사용자', email : 'user2@email.com'},
              {id : 3, name : '3번 사용자', email : 'user3@email.com'}
        ]
      }
    }
}
</script>

<style>  
  ul { list-style-type: circle; }
  li { padding: 5px; }
</style>
```

## 3) UserDetailView.vue 파일 추가
```vue
<template>  
  <h1>User Detail</h1>   
  <p>사용자 id : {{ $route.params.id }}</p>
  <p>사용자 name : {{users[$route.params.id].name}}</p>
  <p>사용자 email : {{users[$route.params.id].email}}</p>
</template>

<script>
export default { 
    data() {
      return {
          users : [
              {id : 0, name : '0번 사용자', email : 'user0@email.com'},
              {id : 1, name : '1번 사용자', email : 'user1@email.com'},
              {id : 2, name : '2번 사용자', email : 'user2@email.com'},
              {id : 3, name : '3번 사용자', email : 'user3@email.com'}
          ]
      }
    }
}
</script>
```
## 4) UserItem.vue 파일 추가
```vue
<script>
export default {
  props: {
    user: Object
  }
}
</script>

<template>
  <li><a v-bind:href="'/users/'+user.id">{{ user.name }} 정보 보기</a></li>
</template>
```

## 5) users 경로에 접속하여 확인하기

![]({{ site.baseurl }}/assets/images/post/vue/vue3_vfor_list2.png){: style="width:600px" .image_box}

