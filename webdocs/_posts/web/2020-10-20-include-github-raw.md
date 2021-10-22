---
title: "Github 저장소 프로그램 소스 Pages에서 include 하는 방법"
header:
categories: 
  - javascript
---
<script src="/assets/js/custom.js"></script>

Github Pages의 글을 작성하다보면 Github 저장소의 프로그램 소스 설명이 필요할 때가 있다.    

일반적으로 Github에 공유되고 있는 소스의 특정 부분만 발췌할 때는 markdown의 코드블럭 기능을 이용한다.    
소스의 전체를 설명할 때에도 동일하게 코드블럭 기능을 이용하여 중복으로 작성해도 되지만, 
Github의 소스를 수정하여 업데이트 한 경우 블로그에 작성된 소스까지 업데이트 해주지는 않는다.

이 글은 게시글에 포함된  Github의 소스를 최신 버전으로 유지하고 싶을 때 중복으로 작성하지 않고,
소스를 그대로 게시글에 include 하여 보여주는 방법에 대해 설명하려 한다.

---

#### 1. Github에 공유되고 있는 소스
 + Github 저장소 파일보기에서 Raw버튼 클릭
 
> ![]({{ site.baseurl }}/assets/images/post/sw/include_github01.png){: style="width:700px"}

 + Raw버튼의 기능은 html등 기타 정보없이 순수 텍스트만 제공
 
> ![]({{ site.baseurl }}/assets/images/post/sw/include_github02.png){: style="width:700px"}


#### 2. 소스를 읽어들일 자바스크립트 작성
아래 자바스크립트는 url의 response를 텍스트로 읽어들여 그대로 객체의 innerText에 출력해준다.

```javascript
function showJsonFromGit(url, emId) {
  fetch(url)
  .then(res => res.text())
  .then((out) => {
    document.getElementById(emId).innerText = out
  })
  .catch(err => { throw err });
}
```

#### 3. 소스를 포함하고 싶은 페이지에 코드 추가 
아래 html은 show1 객체에 url의 내용을 출력해준다.

```html
<pre id="show1" class="show-json-from-git">소스 로딩실패</pre>
<script>showJsonFromGit('https://raw.githubusercontent.com/onda2me/arduino_s/master/s1/sketch_servo_button/sketch_servo_button.ino', 'show1');</script>
```

#### 4. 자바스크립트 처리결과 
소스를 직접 작성한 것이 아니라 Github 저장소의 소스를 그대로 include하여 보여준다.
[Github 저장소 소스와 비교하기](https://github.com/onda2me/arduino_s/blob/master/s1/sketch_servo_button/sketch_servo_button.ino){: .btn.btn--primary.btn--narrow target="_blank" }

<pre id="show1" class="show-json-from-git">소스 로딩실패</pre>
<script>showJsonFromGit('https://raw.githubusercontent.com/onda2me/arduino_s/master/s1/sketch_servo_button/sketch_servo_button.ino', 'show1', '300px');</script>

#### 5. 커스트 마이징
깃허브 페이지에서 소스 설명을 주로 하는 알고리즘 카테고리는 
글 작성시 자바스크립트를 포스트마다 추가하지 않고 내용만 작성하면 되도록 
레이아웃 (/_layouts/embeddedcode.html)을 분리한뒤 레이아웃 페이지에 자바스크립트를 추가하였다.

{% capture notice-text %}
   1. javascript 작성
   2. 포스트에 javascript 추가
   3. 소스내용을 출력한 객체 추가  
{% endcapture %}


#### GitHub 저장소 소스 include
{{ notice-text | markdownify }}{: .notice--info}




