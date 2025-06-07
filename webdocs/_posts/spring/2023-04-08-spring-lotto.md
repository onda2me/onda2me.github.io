---
title: "번호별 당첨통계 데이타를 이용한 로또번호 생성기"
categories: 
  - springboot
tags:
  - springboot
  - 로또번호
  - 재귀함수
header:
  teaser: /assets/images/post/thymeleaf/lotto-generator3.gif
---

# Lotto 6/45 6개의 랜덤 번호를 만들어 주는 로또번호 생성기 
> + 동행복권 사이트의 번호별 당첨통계 데이타를 이용해서 로또 번호6개를 생성하여 출력해 주는 API를 만들어보자
> + 재귀함수 (= 특정 조건이 될 때까지 자기자신을 계속 호출하는 함수)를 이용하여 로또 번호 생성기를 만들어 보자
{: .notice--primary}

## 로또번호 생성기
 ![로또번호 생성기 UI]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-generator3.gif){: style="width:700px" .image_box}


## 알고리즘

예를들어 각 번호의 당첨횟수가 아래와 같을 때 당첨횟수에 따라 당첨구간을 설정한다.    
![로또번호별 당첨횟수]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-api-01.png){: style="width:400px" .image_box}

+ **각 번호의 당첨 누적위치 : sum**    

> 1의 당첨 누적위치: sum(1) = arr[1]    
> 2의 당첨 누적위치: sum(2) = arr[2] + sum(1)    
> 3의 당첨 누적위치: sum(3) = arr[3] + sum(2)    
> 4의 당첨 누적위치: sum(4) = arr[4] + sum(3)    

**sum(n) = arr(n) + sum(n-1)**  
{: .notice--primary}  


+ **각 번호의 당첨 구간 : length**    

> 1의 당첨 구간  : 0+1 ~ sum(1)    
> 2의 당첨 구간  : sum(1)+1 ~ sum(2)    
> 3의 당첨 구간  : sum(2)+1 ~ sum(3)    
> 4의 당첨 구간  : sum(3)+1 ~ sum(4)    

**length(n) = sum(n-1)+1 ~ sum(n)**  
{: .notice--primary}  
    
+ **로또 숫자 생성 순서**    

> 1. 재귀함수를 이용하여 각 숫자별 당첨회수의 누적위치를 구한다.
> 2. 랜덤함수를 이용하여 최대 누적위치 (= 1부터 45 까지의 당첨횟수의 합) 내에서 랜덤숫자를 생성한다.
> 3. 랜덤숫자에 해당하는 당첨 구간을 구한다.
> 4. 당첨 구간에 해당하는 로또 숫자를 구한다.
> 5. 로또 숫자가 6개가 될때까지 2~4번을 반복한다.
> 6. 로또 숫자 6개를 출력한다.

---

## 1. AutoGeneratorNumberMain.Java 작성

```java
// 번호별 당첨횟수
public static int b_nums[]   = {146,141,140,141,140,134,139,137,113,140,144,156,151,152,144,138,152,155,140,148,142,123,126,140,135,143,154,127,134,128,142,123,147,162,137,143,146,139,150,147,131,138,148,141,151};
//public static int b_nums[]     = {1, 1, 1, 1, 1, 1}; // 데이타 검증 용 

    //---------------------------------------------
    // 번호 생성 함수
    //---------------------------------------------    
    public String generator(int type)  {

        final int LOTTO_SIZE       = 6;
        final int NUMBER_SIZE      = b_nums.length;
        
        int a_nums[]               = new int[NUMBER_SIZE];
        int totalOdds              = 0;
        
        Set<Integer> rdnSet = new HashSet<Integer>();   // 로또번호 저장, Unique 보장을 위해 Set 이용
        StringBuilder builder = new StringBuilder();
        
        //---------------------------------------------
        // STEP1. 번호별 확률 누적위치 저장
        //---------------------------------------------    
        totalOdds = sum(NUMBER_SIZE-1, b_nums, a_nums);
        logger.debug("--------------------");
        logger.debug("totalOdds : " + totalOdds);
        logger.debug("--------------------");
                
        //---------------------------------------------
        // STEP2. 최대 누적값 내 랜덤숫자 생성
        //---------------------------------------------    
        Random rd = new Random();        
        int rdnNum = 0;
        int idx = 0;
        while(rdnSet.size() < LOTTO_SIZE) {
            
            // 랜덤숫자 생성
            rdnNum = rd.nextInt(totalOdds)+1;
            
            // 랜덤숫자 -> 누적위치 검색
            for(int i=0; i<a_nums.length; i++) {
                //logger.debug(idx +"." + i + " [" +rdnSet.size()+"] ----> " + rdnNum +" <= " + a_nums[i]);
                
                // 누적위치에 해당하는 숫자(=배열위치) 저장 
                if(rdnNum <= a_nums[i]) {
                    rdnSet.add(i+1);
                    logger.debug(idx +"." + i + " [" +rdnSet.size()+"] ----> " + rdnNum +" <= " + a_nums[i]);
                    logger.debug("--------------------");                  
                    break;
                }
            }
            idx++;
        }
        
        //---------------------------------------------
        // STEP3. 생성한 랜덤숫자 출력 : 5,2,3 ...
        //--------------------------------------------- 
        Iterator<Integer> iter = rdnSet.iterator();
        while(iter.hasNext()) {
            builder.append(iter.next()).append(",");
        }
        
        builder.delete(builder.length()-1, builder.length());
        
        logger.debug("random number : " + builder.toString());
        return builder.toString();
    }
    
    //---------------------------------------------
    // 재귀함수를 이용하여 확률 누적값 저장
    // 당첨횟수 배열 -> 누적위치 배열 
    //---------------------------------------------
    public static int sum(int n, int[] bnums, int[] anums) {
        // n = 0 이면 반복수행 중단
        if(n == 0) {
            anums[0] = bnums[0];
        } else {          
            anums[n] = bnums[n] + sum(n-1, bnums, anums);
        }

        logger.debug("array["+n+"] " + anums[n]);
        return anums[n];
    } 
```
## 2. 데이타 검증
> 총 13번 실행하여 6개의 unique 숫자 생성    

![데이타 검증]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-api-03.png){: style="width:400px" .image_box}

## 3. Web API 작성

```java
    @RequestMapping(value = "/api/make/get", method = RequestMethod.GET)
    public String get(Model model) {

        String nums = new AutoGeneratorNumberMain().generator(0);
        return nums;
    }
```    
![Web API]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-api-04.png){: style="width:400px" .image_box}

## 참고
+ **로또번호 생성기**  [로또번호 생성기 바로가기](https://ondago365.web.app/play/lotto.html){: .btn.btn--primary.btn--narrow target="_blank" } 
  > 로또번호 생성기는 요청중일때만 CPU가 할당되어, 첫 호출은 10초 가량 응답지연이 발생할 수 있음  

    <iframe width="800" height="420" src="https://api-project-209152001727.web.app/pages/lotto-ifr.html" frameborder="0"  style="width:100%; height:600px;" allowfullscreen></iframe>
<!--     
    <iframe width="800" height="420" src="https://onda2me-677983124526.asia-northeast3.run.app/lotto" frameborder="0"  allowfullscreen></iframe> 
-->
+ **Thymeleaf**를 이용한 [로또번호 생성기 UI 글보기](/springboot/thymeleaf-lotto/){: .btn.btn--primary.btn--narrow target="_blank" }

   ![로또번호 생성기 UI]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-service-02.png){: style="width:700px" .image_box}

+ **동행복권 사이트** 에서
[번호별 당첨 통계 확인 및 데이타 받기](https://www.dhlottery.co.kr/gameResult.do?method=statByNumber){: .btn.btn--primary.btn--narrow target="_blank" }

   ![로또번호별 당첨횟수]({{ site.baseurl }}/assets/images/post/thymeleaf/lotto-api-02.png){: style="width:700px" .image_box}



