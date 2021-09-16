---
permalink: /algorithm/
title: "Algorithm"
layout: collection
classes: wide
collection: algorithm
author_profile: true
entries_layout: list
---

---
이 글은 Java 알고리즘에 대한 내용이다.  
알고리즘 관련 소스 등의 자료는 개인 저장소인
[[GitHub 알고리즘 바로가기]](https://github.com/onda2me/algorithm){: .btn.btn--primary.btn--narrow target="_blank" }에 지속적으로 업로드 할 예정이다.  
자바에 대한 자료는 [[TCPSchool]](http://tcpschool.com/java/intro){: .btn.btn--primary.btn--narrow target="_blank" }에 잘 설명되어 참고 사이트로 유용히 활용할 수 있을 것이다.

---


<ul class="posts-list">
 
  {% assign category = page.category | default: page.title %}
  {% for post in site.categories[category] %}
    <li>
      <h5>
        <a href="{{ site.baseurl }}{{ post.url }}">
          {{ post.title }}
        </a>
        <small>{{ post.date | date_to_string }}</small>
      </h5>
    </li>
  {% endfor %}
  
</ul>


