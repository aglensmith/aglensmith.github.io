---
layout: homepage
title: Austin Smith
tagline: Supporting tagline
---
{% include JB/setup %}

<ul >
    {% for post in site.posts limit:1 %}
    <a href="{{ BASE_PATH }}{{ post.url }}">
    <h1 class="PostTitle">{{ post.title }}</h1>
    <div class="PostDate"><span class="PostDate">{{ post.date | date_to_string }}</span></div>
    </a>
        {{ post.content}}<br>
    {% endfor %}
</ul>

####Other Posts:
<ul class="posts">
  {% for post in site.posts limit 5 %}
    <li><span>{{ post.date | date_to_string }}</span> &raquo; <a href="{{ BASE_PATH }}{{ post.url }}">{{ post.title }}</a></li>
  {% endfor %}
</ul>




