---
title: "Spring Boot Batch?"
categories: 
  - springboot
tags:
  - springboot
header:
  teaser: /assets/images/post/spring/boot_batch_00.png
---

# 배치 (Batch) ?
매일 새벽 전날의 일일 매출 집계 작업, 배송완료 7일 경과한 주문건의 자동구매 확정 작업, 1년이상 미사용 회원에 대한 휴면 처리 작업 등 
매분, 매시, 매일 등의 특정 시간에 해야하는 작업이나, 대량의 데이터를 처리하는 것을 Batch 라고 한다.

# 스프링부트 배치 ?

+ 백엔드의 배치 기능을 제공하는 프레임워크
+ 대용량 데이터 처리에 최적화 됨
+ 로깅, 통계, 트랜잭션 관리 기능 지원

## Job

+ Job은 배치 처리 작업의 단위

## Step

+ Job을 처리하는 실질적인 단위
    
## Batch Job 실행
+ @Scheduled  / Web Call / Quartz 등을 이용하여 특정시간에 주기적으로 실행하거나, 호출로 특정 Job을 즉시 실행 시킬 수 있다.

![Batch 와 Batch 실행 구조]({{ site.baseurl }}/assets/images/post/spring/boot_batch_00.png){: style="width:700px" .image_box}

## 개발환경
> + Spring Boot v2.7.8
> + Java 11.0.16.1
> + Apache Tomcat 9.0.71

![Batch 개발환경]({{ site.baseurl }}/assets/images/post/spring/boot_batch_01.png){: style="width:700px" .image_box}

# Scheduled 배치 프로젝트
> + 매분 10초에 로그를 출력하는 간단한 배치작업(Job)을 만들고 @Scheduled 를 이용하여 배치작업 실행하기    

## 1. 프로젝트 생성하기

> + Spring Project 생성할 때 Spring Batch dependency를 선택하거나 pom.xml 에 dependency를 직접 추가한다.

![프로젝트 생성]({{ site.baseurl }}/assets/images/post/spring/boot_batch_02.png){: style="width:350px" .image_box}

```xml
<!-- @pom.xml -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-batch</artifactId>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
```


## 2. SpringBootApplication.java 작성
> + 배치기능을 이용하기 위한 어노테이션 (@EnableBatchProcessing) 추가    

```java
@SpringBootApplication
@EnableBatchProcessing // 배치기능 활성화 어노테이션
public class Falcon1bootApplication {

public static void main(String[] args) {
        SpringApplication.run(Falcon1bootApplication.class, args);
    }
}
```

## 3. application.properties 에 property 설정
> + @application.properties 에 spring.batch.job.enabled=true 로 설정하면, SpringBootApplication 기동 시 자동실행 된다.    
> + 이 예제에서는 특정 시간에 Job을 실행시키려고 하므로 false로 설정한다.

```text
# @application.properties
# batch 관련 설정
spring.batch.job.enabled=false      // SpringBootApplication 기동시 Batch 자동실행 여부 (true/false)
spring.batch.job.names=simpleJob    // 자동실행 할 Job 이름
```
## 4. Job Configuration Class 작성

```java
/*
    @SimpleJobConfiguration.java :
        + Job을 실행하면 Job -> Step1 -> tasklet: 로그출력  -> 종료
*/
@Configuration
@RequiredArgsConstructor
public class SimpleJobConfiguration {
    
    private static final Logger log = LoggerFactory.getLogger(SimpleJobConfiguration.class);

    @Autowired
    private JobBuilderFactory jobBuilderFactory;;

    @Autowired
    private StepBuilderFactory stepBuilderFactory;

    private final String JOB_NAME = "simpleJob";

    public String getJobName() {
        return this.JOB_NAME;
    }

    @Bean(JOB_NAME)
    public Job executeJob() {    // Job
        return jobBuilderFactory.get(JOB_NAME)
                .start(simpleStep1())
                .build();
    }

    @Bean(name = JOB_NAME+"Step1")
    public Step simpleStep1() {    // Step -> tasklet -> 로그출력

        return stepBuilderFactory.get(JOB_NAME+"Step1")
                .tasklet((contribution, chunkContext) -> {

                    logger.debug("----------------------");
                    logger.debug(">>>>> This is "+JOB_NAME+".Step1");
                    logger.debug(">>>>> Job Params : " + chunkContext.getStepContext().getJobParameters());
                    logger.debug("----------------------");

                return RepeatStatus.FINISHED; })
            .build();
    
    }
}
```

## 5. Job을 실행시킬 Scheduler Class 작성

```java
/*
    @SimpleJobScheduler.java : 
        + 매분 10초에 SimpleJob을 실행시킬 Scheduler
*/
@RequiredArgsConstructor
@Component
public class SimpleJobScheduler {
    
    private final Logger logger = LoggerFactory.getLogger(SimpleJobScheduler.class);    
    private final JobLauncher jobLauncher;
    private final SimpleJobConfiguration jobConfig;
    
    @Scheduled(cron = "10 * * * * ?") // 초(0-59) 분(0-59) 시간(0-23) 일(1-31) 월(1-12) 요일(0-7)
    public String executeScheduler() {
        
        logger.debug("================================");
        logger.debug("start");
        
        try {
        	
            String launchDate = DateUtil.getDate("yyyyMMdd");
            String launchTime = DateUtil.getDate("HHmmss");
            
            JobParameters jobParams = new JobParametersBuilder()
                    .addString("launchDate", launchDate)
                    .addString("launchTime", launchTime)
                    .addString("channel", IConstants.BATCH_CHANNEL_SCHEDULER)
                    .toJobParameters();
        
            JobExecution jobExecution = 
                    jobLauncher.run(jobConfig.executeJob(), jobParams);

        } catch (JobInstanceAlreadyCompleteException e) {
            e.printStackTrace();
        } catch (JobParametersInvalidException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        logger.debug("end");
        logger.debug("================================\n\n");
        
        return "success";        
    }
}
```

## 6. SpringBootApplication 실행
> + 매분 10초에 로그 출력하는 Job 실행    

![]({{ site.baseurl }}/assets/images/post/spring/boot_batch_06.png){: style="width:700px" .image_box}


# Web Call 배치 프로젝트
> + Batch 호출용 Controller를 작성하여 위에서 작성한 Job (SimpleJobConfiguration.java)을  Web Call 방식으로 실행

## 1. Job을 실행시킬 Batch Controller Class 작성

```java
/*
    @BatchController.java : 
        + Web API Call 방식으로 Job 실행
*/
@RestController
@RequestMapping("/batch")
@RequiredArgsConstructor
public class BatchController {

    private final Logger logger = LoggerFactory.getLogger(BatchController.class);

    @Autowired
    SimpleJobConfiguration simpleJobConfig;    
    
    @Autowired
    JobLauncher jobLauncher;

    @Autowired
    ApplicationContext context;
 
    @GetMapping("/simpleJob")
    public ExitStatus simple(Locale locale) throws Exception {

        String launchDate = DateUtil.getDate("yyyyMMdd");
        String launchTime = DateUtil.getDate("HHmmss");
        
        JobParameters jobParams = new JobParametersBuilder()
                .addString("launchDate", launchDate)
                .addString("launchTime", launchTime)
                .addString("channel", "WEB")
                .toJobParameters();
    
        logger.debug("================================");
        logger.debug("start");

        JobExecution jobExecution = 
                jobLauncher.run(simpleJobConfig.executeJob(), jobParams);
                
        logger.debug("end");        
        logger.debug("================================");
        
        return jobExecution.getExitStatus();
    }
}

```
## 2. Web Call로 Job 실행하기
> + http://localhost:8007/batch/simpleJob
> + Job 실행 방법은 다르지만, SimpleJobConfiguration이 실행되어 Step1 로그는 동일하게 출력

![]({{ site.baseurl }}/assets/images/post/spring/boot_batch_21.png){: style="width:350px" .image_box}    
![]({{ site.baseurl }}/assets/images/post/spring/boot_batch_23.png){: style="width:700px" .image_box}


## 3. Batch 데이타 확인
 > + batch_job_instance, batch_job_execution, batch_job_execution_params, batch_step_execution 의 데이타 확인    
 > + 이 웹화면은 Batch 모니터링을 위해 직접 개발한 것으로, Batch 테이블의 데이타는 DB 조회로 직접 확인

![]({{ site.baseurl }}/assets/images/post/spring/boot_batch_24.png){: style="width:700px" .image_box}    
![]({{ site.baseurl }}/assets/images/post/spring/boot_batch_25.png){: style="width:700px" .image_box}
