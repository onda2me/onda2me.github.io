---
title:  "Markdown 사용법 및 테스트"
categories: 
  - jekyll
tags:
  - jekyll
  - markdown
---
> 타이틀 사용법    

```

# 제목1
## 제목2
### 제목3
#### 제목4
##### 제목5
###### 제목6

```
# 제목1
## 제목2
### 제목3
#### 제목4
##### 제목5
###### 제목6

> 테이블 사용법     

```
입    력 |  출    력     
----- | -----    
1, 1 |  1 
5, 54321 | 15    
25, 7000000000000000000000000 | 3
11, 10987654321 | 46
```

입    력 |  출    력     
----- | -----    
1, 1 |  1 
5, 54321 | 15    
25, 7000000000000000000000000 | 3
11, 10987654321 | 46

> 숫자없는 리스트    

```
+ 구분1
+ 구분2
  + 구분2-1
  + 구분2-2
+ 구분3
```
+ 구분1
+ 구분2
  + 구분2-1
  + 구분2-2
+ 구분3

> 숫자있는 리스트    

```
1. 목록1   
2. 목록2
3. 목록3   
```

1. 목록1   
2. 목록2
3. 목록3 


> 코드 입력하는 법

```ruby
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
```

> 이미지 사용법    

```
![](이미지 주소){: .img-thumbnail style="width:600px"}
```

> 링크 사용법    

```
[링크 이름](http://링크주소){: .btn.btn--primary.btn--narrow target="_blank" }
```

> 변수 링크 사용법    

```
변수로 링크 만드는 법입니다. 
첫번째 링크는 [Jekyll docs][jekyll-docs]{: .btn.btn--primary.btn--narrow target="_blank" }  
두번째 링크는 [Jekyll's GitHub repo][jekyll-gh]{: .btn.btn--primary.btn--narrow target="_blank" }
세번째 링크는 [Jekyll Talk][jekyll-talk]{: .btn.btn--primary.btn--narrow target="_blank" }

[jekyll-docs]: http://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/

```

변수로 링크 만드는 법입니다. 
첫번째 링크는 [Jekyll docs][jekyll-docs]{: .btn.btn--primary.btn--narrow target="_blank" }  
두번째 링크는 [Jekyll's GitHub repo][jekyll-gh]{: .btn.btn--primary.btn--narrow target="_blank" }  
세번째 링크는 [Jekyll Talk][jekyll-talk]{: .btn.btn--primary.btn--narrow target="_blank" }

[jekyll-docs]: http://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/

