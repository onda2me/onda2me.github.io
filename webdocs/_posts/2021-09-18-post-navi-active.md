---
title: "메뉴 네비게이션에 Active 효과주기"
header:
categories: 
  - navi
---

활성화된 메뉴에 Active 효과를 추가해 보았다.  
`/minimal-mistakes/` 테마는 메뉴의 Active 기능이 없어서 scss 와 html 파일 수정이 필요하다.  

![]({{ site.baseurl }}/assets/images/post/navi_active.png){: style="width:700px"}

---

#### 1. /include/masthead.html 코드 추가
```html
// 원본 코드
<ul class="visible-links">
    {%- for link in site.data.navigation.main -%}
    <li class="masthead__menu-item">
        <a href="{{ link.url | relative_url }}"{% if link.description %} title="{{ link.description }}"{% endif %}>{{ link.title }}</a>
    </li>
    {%- endfor -%}
</ul>

// 추가 코드
// a 태그에 class 추가
    <li class="masthead__menu-item">
        <a href="{{ link.url | relative_url }}"{% if link.description %} title="{{ link.description }}"{% endif %} class="nav-link {% if page.url contains link.url %}active{% endif %}">{{ link.title }}</a>
    </li>

```

#### 2. /_sass/minimal-mistakes/_navigation.scss 코드 추가

```scss
  .nav-link { // a 태그 클래스
    display: block;
  }
  .nav-link.active {
    font-weight:900;    // acive 시 폰트 굵게
    color:$darker-gray; // acive 시 조금 어둡게
  }
```

#### 3. /_layouts/default.html 코드 수정

```html
- //include_cached masthead.html
+ include masthead.html    
```



**Tips:가장 중요한 부분** masthead.html 파일에서 현재 페이지 주소를 가져오지 못해서 원인을 찾느라 한참 고생했다.  
masthead.html 파일을 include 가 아닌 include_cached 하고 있었다.  
masthead.html 파일을 include_chched에서 include 로 변경한다.  
{: .notice--info}  
