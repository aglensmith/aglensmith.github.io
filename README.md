# aglensmith.github.io

My personal [website](https://www.aglensmith.com/).

## Develop

```bash
sudo docker run -v $(pwd):/site -it --entrypoint bash bretfisher/jekyll
bundle install --retry 5 --jobs 20
bundle exec jekyll build

exit

sudo docker run -p 4000:4000 -v $(pwd):/site bretfisher/jekyll-serve
```

## About

This theme is a fork of [Indigo](https://github.com/sergiokopplin/indigo).