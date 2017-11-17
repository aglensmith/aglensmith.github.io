---
title: "Installing Jekyll Site Locally"
layout: post
date: 2017-11-16 21:07
image: /assets/images/jekyll-logo.png
headerImage: false
tag:
- jekyll
- blog
- static
- site
category: blog
author: Austin Smith
description: How to install a jekyll site locally
---

*This is a generic walk-through for setting up a jekyll site on your local machine. This is mainly a reminder for myself because I always seem to forget when setting up on a new or different machine!*

## Get a theme
---

Use your favourite search engine to find a jekyll theme you like (or make your own!). Here's an example. Theme authors usually include theme installation instructions; follow those and download and install any required dependencies. Below are steps common to all themes. 

## Install ruby and associated ruby-dev
---

Jekyll runs on ruby, so we'll need to install it. There's also some dependencies on ruby-dev, so lets get that too: 

```
sudo apt-get install ruby ruby-dev
```

## Install Jekyll and Bundler
---

Jekyll is the static site generator that builds the markup for the site. Install it using gem:

```
gem install jekyll bundler
```

For more info and options, see: https://jekyllrb.com/docs/quickstart/

## Install NodeJS (Required for certain themes)
---

```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Specific instructions: https://nodejs.org/en/download/package-manager/

## If you're missing Gemfile
---

I somehow manage to be missing a Gemfile when a clone into my site's repo for the first time on a new machine, which throws errors when attempting to do `bundle install`. If you get those errors, make a Gemfile: 

```
touch Gemfile
sudo vim Gemfile
```

Here's the Gemfile from the theme linked above (your's might be different):

```
source 'http://rubygems.org'

gem 'github-pages'
gem 'html-proofer'
gem 'jekyll-admin'
```

## Serve site locally
---

You should now be ready to serve the site locally. Run: 

```
bundle exec jekyll serve
```

You should see: 

```
...
Server address: http://127.0.0.1:4000
Server running... press ctrl-c to stop.
```

Browse to the server address to view your site. 


## Troubleshooting

* `Could not locate Gemfile or .bundle/ directory` - Add Gemfile to site root
* `mkmf.rb can't find header files for ruby at /usr/lib/ruby/ruby.h` - install ruby-dev

