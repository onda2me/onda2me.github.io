# [Minimal Mistakes Jekyll theme](https://mmistakes.github.io/minimal-mistakes/)

**Onda2me:** Minimal Mistakes 테마를 사용하여 만든 GitHub Page

[![Onda2me live preview][1]][2]

[1]: /assets/images/main/onda2me_01.PNG (live preview)
[2]: https://onda2me.github.io/

## 디렉토리 구조

**Please note:**  
```
Minimal Mistakes 테마를 적용한 뒤 커스트마이징 하였다.
```

```bash
onda2me                        # minimal-mistakes 디렉토리명 변경
├── _data                      # data files for customizing the theme
|  ├── navigation.yml          # main navigation links
|  └── ui-text.yml             # page내 한글/영어 UI 문구 Config
├── _includes
|  ├── analytics-providers     # snippets for analytics (Google and custom)
|  ├── comments-providers      # snippets for comments
|  ├── footer
|  |  └── custom.html          # custom snippets to add to site footer
|  ├── head
|  |  └── custom.html          # custom snippets to add to site head
|  ├── search                  # 
|  |  ├── google-search-scripts.html 
|  |  └── search_form.html           
|  └── ...
├── _layouts
|  ├── archive-taxonomy.html   # tag/category archive for Jekyll Archives plugin
|  ├── archive.html            # archive base
|  ├── categories.html         # archive listing posts grouped by category
|  ├── category.html           # archive listing posts grouped by specific category
|  ├── collection.html         # archive listing documents in a specific collection
|  ├── compress.html           # compresses HTML in pure Liquid
|  ├── default.html            # base for all other layouts
|  ├── home.html               # home page
|  ├── posts.html              # archive listing posts grouped by year
|  ├── search.html             # search page
|  ├── single.html             # single document (post/page/etc)
|  ├── splash.html             # 확인중
|  ├── tag.html                # archive listing posts grouped by specific tag
|  ├── tags.html               # archive listing posts grouped by tags
|  └── splash.html             # splash page
├── _sass                      # SCSS partials
|  ├── minimal-mistakes        # minimal-mistakes theme directory
|  |  ├── skins                # jQuery plugins
|  |    ├── _air.scss          # deault skin
|  |    ├── _aqua.scss         # aqua skin
|  |    └── ...                # etc skin
|  |  ├── vendor               # vendor scss
|  |  ├── _archive.scss        # archive layout scss
|  |  ├── _base.scss           # base (= common) scss
|  |  ├── _footer.scss         # footer layout scss
|  |  └── ...                  # etc scss
|  └── minimal-mistakes.scss   # minimal-mistakes theme import scss
├── assets
|  ├── css
|  |  └── main.scss            # main stylesheet, loads SCSS partials from _sass
|  ├── images                  # image assets for posts/pages/collections/etc.
|  |  ├── blog                 # blog images directory 
|  |  └── main                 # main images directory
|  ├── js
|  |  ├── plugins              # jQuery plugins
|  |  ├── vendor               # vendor scripts
|  |  ├── _main.js             # plugin settings and other scripts to load after jQuery
|  |  └── main.min.js          # optimized and concatenated script file loaded before </body>
├── webdocs                    # post file directory
|  ├── _algorithm              # algorithm category post 
|  ├── _blog                   # blog category post
|  ├── _pages                  # page post
|  └── _posts                  # post
├── _config.yml                # site configuration
├── Gemfile                    # gem file dependencies
├── index.html                 # paginated home page showing recent posts
└── package.json               # NPM build scripts
```



