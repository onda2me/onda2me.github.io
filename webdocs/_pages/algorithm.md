---
permalink: /algorithm/
title: "Algorithm"
layout: collection
excerpt: "Algorithm"
collection: algorithm
entries_layout: list
classes: wide
last_modified_at: 2021-09-11
toc: false
author_profile: false
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