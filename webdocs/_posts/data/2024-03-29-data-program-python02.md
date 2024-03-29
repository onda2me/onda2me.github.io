---
title: "파이썬의 데이터 유형과 기본문법"
categories: 
  - data
tags:
  - data
  - phython
header:
  teaser: /assets/images/post/data/data-program-phy-21.png  
---

## 파이썬의 자료형

| 자료형 | 자료형 | 예시 | 설명 |
| :--: | :--: | :-- | :-- |
| 숫자정수	| int	 | 0, 1, 10,  -20	| 음의정수, 0, 양의정수 | 
| 숫자실수 | float	 | 0.2, 3.14. -35.012 | 부동소수점수 | 
| 문자열 | str | 'hello', '안녕하세요'	 | 텍스트를 다루는 자료형으로 ' 나 "의 쌍으로 표현  | 
| 바이트 | bytes | bytes([119,115,107,105]) | -  | 
| 논리형 | boolean | True, False	 | -  | 
| 리스트 | list | [1, '홍길동', 'hong@mail.com', 32] | 데이터의 목록을 다루며 대괄호[] 사이에 데이터 표기 | 
| 튜플 | tuple | ('apple','cherry', 'grape') | -  | 
| 딕셔너리 | dict | {'red':'apple', 'yellow':'바나나'} | 키-값으로 구성된 데이터 | 
| 집합 | set |  {4, 'string', True}	 | 순서가 정해지지 않는 집합 | 

## 파이썬의 기초 문법

### 1. 출력문

```python
# 문자열 출력
print("hello")
print("------------")

# 문자열 정의 후 출력
str = "hello world"
print(str)
print("------------")

# 문자열 -> 배열 변환 -> 출력
arr = str.split(" ")
print(arr)
print(arr[1])
print("------------")
```

![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-21.png){: style="width:400px" .image_box} 

### 2. if문
```python
price = 90  
if(price > 100):
    print("buy")
elif(price > 80):
    print("pending")  
else:
    print("sell") 

```
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-22.png){: style="width:400px" .image_box} 


### 3. for문
```python
for i in [1,2,3,4,5] :
  print(i)

print("------------")

for i in range(0, 10, 2):
  print(i)
```
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-23.png){: style="width:400px" .image_box} 


### 4. while문
```python
i = 0
while i < 10:
  print(i)
  i += 1
```
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-24.png){: style="width:400px" .image_box} 


### 5. 함수
```python
i = 0
def sum(a, b):
  c = a+b
  return c

print(sum(2,3))
```
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-25.png){: style="width:400px" .image_box} 

### 6. 클래스
```python
class Student:
  numOfStudent = 0

  def __init__(self,name, score): 
    self.name = name; 
    self.score = score 
    Student.numOfStudent += 1 

  def grade(self):
    if self.score > 90:
      self.grade = "A"
      
    elif self.score > 80:
      self.grade = "B"
    else:
      self.grade = "F"

    print(self.numOfStudent, ". ", self.name, "'s grade = ", self.grade)

s = Student("Hong", 82)
s.grade()

s = Student("Kim", 95)
s.grade() 
```
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-26.png){: style="width:400px" .image_box} 

### 7. 주석
```python
  + 파이썬 한줄 주석 : # 
    # 샵 뒤의 글은 주석으로 인식한다.

  + 파이썬 여러줄 주석 : """ ~ """ 또는 ''' ~ '''
    """
      따옴표 사이의 글은 주석으로 인식한다.
      여러줄을 작성 할 수 있다.
    """

```

### 8. 문자열 포맷팅

```python
data = 3
print("This data =", data)

fmt = "This data = {}".format(data)
print(fmt)

fmt = f"This data = {data}"
print(fmt)

fmt = f"This data = {data:03d}"
print(fmt)
```
![]({{ site.baseurl }}/assets/images/post/data/data-program-phy-27.png){: style="width:400px" .image_box} 

---

