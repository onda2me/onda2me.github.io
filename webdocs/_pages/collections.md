---
permalink: /collections/
layout: collection
title: "Documents by Collection"
classes: wide
author_profile: true
entries_layout: list
sort_order: reverse
---
{% capture written_label %}'None'{% endcapture %}

<div>

{% assign entries_layout = page.entries_layout | default: 'list' %}
{% for collection in site.collections %}

  {% unless collection.output == false or collection.label == "posts" %}
    {% capture label %}{{ collection.label }}{% endcapture %}
    {% if label != written_label %}
      <a href="/{{ label }}/"><h2 id="{{ label | slugify }}" class="archive__subtitle">{{ label }} </h2></a>
      {% capture written_label %}{{ label }}{% endcapture %}
    {% endif %}
  {% endunless %}
<p>start . list</p>
  {% for post in collection.docs %}
    {% unless collection.output == false or collection.label == "posts" %}
      {% include archive-single.html  %}
    {% endunless %}
  {% endfor %}

{% endfor %}
</div>
