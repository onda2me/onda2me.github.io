---
title: Pets
layout: collection
permalink: /pets/
collection: pets
entries_layout: grid
classes: wide
---

Sample document listing for the collection `_pets`. 1012


[[`pets.tabby`](/pets/tabby/)]

[[`pets.cats1`](/pets/cats/)]

[[`category`](/categories/)]

[[`collection`](/collection/)]



<ul class="posts-list">
  
  {% assign category = page.category | default: page.title %}
  {% for post in site.categories[category] %}
    <li>
      <h3>
        <a href="{{ site.baseurl }}{{ post.url }}">
          {{ post.title }}
        </a>
        <small>{{ post.date | date_to_string }}</small>
      </h3>
    </li>
  {% endfor %}
  
</ul>