---
title: "Spring Boot + Thymeleaf 로또번호 생성기"
categories: 
  - springboot
tags:
  - springboot
  - thymeleaf
  - 로또번호
  - ajax
  - jquery
header:
  teaser: /assets/images/post/thymeleaf/lotto-service-10.png
---

# 6개의 랜덤 번호를 만들어 주는 로또번호 생성기 
> 동행복권 사이트의 번호별 당첨통계 데이타를 이용해서 로또 번호6개를 생성하여 출력해 주는 API를 만들었는데,
> Thymeleaf 사용법을 익히기 위한 예제로 UI를 화려하게 구성해 보았다.
{: .notice--primary}

### 서비스 UI    
![로또번호 서비스 UI]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-generator2.gif){: style="width:700px" .image_box}

### 서비스 구조    
![로또번호 구조]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-service.png){: style="width:700px" .image_box}

### 개발환경
> + Spring Boot v2.7.8
> + Java 11.0.16.1
> + Apache Tomcat 9.0.71
> + Thymeleaf 3.0.15
> + jquery 3.6.3



## 1. html 파일 작성
> + number-container : 6개의 숫자 출력을 위한 container
> + h6 : 1 ~ 6까지의 순서 출력
> + number : 생성한 랜덤 숫자 출력
> + show-color : color 및 spin Animation 효과

@UI 구성    
![UI 구성]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-service-01.png){: style="width:700px" .image_box}

@lotto.html
```html
<div class="counter-container">
  <th:block th:each="num : ${#numbers.sequence(1,6)}">
  <div class="number-container ">
    <h6 th:text=${num}></h6>
    <div class="numberbox "><h3 data-target="0" class="number ">0</h3></div>
    <div class="show-color "></div>                
  </div>
  </th:block>          
</div>
```


## 2. css 작성
> + show-color : 번호 구분 원 효과
> + show-change, spin-color : 색 변경 및 spin 효과
> + select-color-* : 로또 5개 색상 구분

```css
.counter-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.number-container {
  text-align: center;
  width: 120px;
  height: 160px; 
  position: relative;
  margin-bottom: 2rem;
}
.number-container h3 {
  padding: 0.5rem 0;
  font-size: 2.5rem;
  font-weight: 800;
}
.number-container h6 {
  font-size: 2rem;
  padding-bottom: 1rem;
}
.numberbox {
  position: absolute;
  text-align: center;
  width: 120px;
  top:63px;
}
.show-color {
  border: 20px solid #f3f3f3; /* Light grey */
  border-top: 20px solid #fbc400;  
  border-radius: 50%;
  position: absolute;
  left:10px;
  top:50px;
  width: 100px;
  height: 100px; 
}		
.show-change {
  animation: spin-color 1s linear infinite; 
}	
.select-color-0 {
  border-color: #fbc400;
  color: #fbc400;
}
.select-color-1 {
  border-color: #69c8f2;
  color:#69c8f2;
}
.select-color-2 {
  border-color: #ff7272;
  color: #ff7272;
}
.select-color-3 {
  border-color: #aaaaaa;
  color:#aaaaaa;
}
.select-color-4 {
  border-color: #b0d840;
  color:#b0d840;
}
.time {
  font-size: 1.15rem;
  padding: 0.15rem;
}
```

## 3. javascript 작성
> 1. 데이타 및 UI 초기화
> 2. 번호 생성 API 호출   
> 3. 데이타 parsing 및 Target 설정
> 4. Animation 효과

```javascript
const counters = document.querySelectorAll(".number");
const spins = document.querySelectorAll(".show-color");

// 버튼 클릭 : 번호생성 API 호출 
function dataSend(){

    // 1. 데이타 및 UI 초기화
    counters.forEach((counter) => {  
        counter.innerText = 0;
        counter.setAttribute("data-target", 0)          
    });
    
    $(".show-color").removeClass(["select-color-0","select-color-1","select-color-2","select-color-3","select-color-4"]);
    $(".show-color").addClass("show-change");
    
    // 2. API 호출
    $.ajax({
        url: "/api/make/get",
        type: 'GET',
        success: function (response) {
          console.log(response);
        },
        error: function (error) {
          console.log(error);
        } 
        }).done(function (data) {

            // 3. 출력할 데이타 parsing 및 target 설정
            const datas = data.split(',');
            let i=0;
            counters.forEach((counter) => {
              counter.setAttribute("data-target", datas[i++])
        });
            
        // 4. 번호 출력 Animation 호출
        setTimeout(loadingNumber, 500);
    });
} 

// 4. 번호 출력 Animation 
function loadingNumber() {

    let totalCnt = 0;
    counters.forEach((counter, idx) => {
                
        const updateCount = () => {        	   
            const target = parseInt(counter.getAttribute("data-target"));
            const count = parseInt(+counter.innerText);
            
            // 4-1. 출력 숫자가 target 숫자가 될 때까지 1씩 증가
            if (count < target) {
                counter.innerText = count + 1;
                setTimeout(updateCount, 150);
                
            // 4-2. 출력 숫자가 target 숫자가 되면 Animation 종료
            } else {
                spins[idx].classList.remove("show-change");
                spins[idx].classList.add("select-color-"+parseInt((target-1)/10));
            }
            
            totalCnt++;
        };         
        updateCount();
    });
    
    // 4-3. 생성 시간 출력
    const d = new Date();
    $("#console").text(d.toLocaleString());
}      
```
## 4. 웹에서 확인
 > + http://localhost:8007/ 접속

  ![실행결과]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-service-02.png){: style="width:700px" .image_box}

