---
title: "GitHub Pages 만들기"
permalink: /blog/
excerpt: "GitHub Pages 만들기"
#layout: collection
layout: archive
classes: wide
collection: blog
author_profile: true
toc: false
entries_layout: list 
---

GitHub Pages는 GitHub에서 제공하는 정적 웹사이트 호스팅 서비스이다.
[[GitHub Pages 바로가기]](https://pages.github.com/){: .btn.btn--primary.btn--narrow target="_blank" }  
GitHub Pages는 GitHub의 공개 Repositories를 사용하여 다른 사용자와 공유가 가능하고, HTML, CSS, Javascript 파일을 저장소에 올리거나 빌드하여 웹사이트에서 서비스가 가능하다.

이 글은 Jekyll을 사용하여 사이트를 구축하고,
(Jekyll 이외의 정적 사이트 생성기도 사용 가능) Git을 통한 연동으로 블로그, 홈페이지 등 다양한 웹사이트 구축에 대한 과정을 정리했다.
GitHub Pages 는 제공되는 테마를 통해 다양한 구성의 웹사이트 구축이 가능하지만, 많은 사람들이 블로그로 이용하기에 블로그 서비스로 인식된다.


{% assign entries = site[ page.collection] %}

{%- for post in entries limit: 1 -%}
  {%- unless post.hidden -%}
    {% include nav_list.html nav=post.sidebar.nav %}
  {%- endunless -%}
{%- endfor -%}