---
title: "Spring Boot Batch Next Step?"
categories: 
  - springboot
tags:
  - springboot
header:
  teaser: /assets/images/post/spring/boot_batch2_00.png
---

# 3개의 Step을 가진 Job을 Scheduled로 실행하는 배치 프로젝트
> + 매분 10초에 로그를 출력하는 간단한 배치작업(Job)을 만들고 @Scheduled 를 이용하여 배치작업 실행하기 

![Batch 와 Batch 실행 구조]({{ site.baseurl }}/assets/images/post/spring/boot_batch2_00.png){: style="width:700px" .image_box}

## 개발환경
> + Spring Boot v2.7.8
> + Java 11.0.16.1
> + Apache Tomcat 9.0.71

![Batch 개발환경]({{ site.baseurl }}/assets/images/post/spring/boot_batch_01.png){: style="width:700px" .image_box}


## 1. 프로젝트 생성하기
> + Spring Project 생성할 때 Spring Batch dependency를 선택하거나 pom.xml 에 dependency를 직접 추가한다.
> + 기존의 Spring Batch 프로젝트에 Job을 추가할 경우 1 ~ 3 번 과정은 건너뛴다.

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
> + 배치기능을 이용하기 위한 어노테이션 (@EnableBatchProcessing) 추가한다.   
> + 기존의 Spring Batch 프로젝트에 Job을 추가할 경우 1 ~ 3 번 과정은 건너뛴다.

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
> + 기존의 Spring Batch 프로젝트에 Job을 추가할 경우 1 ~ 3 번 과정은 건너뛴다.

```text
# @application.properties
# batch 관련 설정
spring.batch.job.enabled=false      // SpringBootApplication 기동시 Batch 자동실행 여부 (true/false)
spring.batch.job.names=simpleJob    // 자동실행 할 Job 이름
```
## 4. Job Configuration Class 작성

```java
/*
    @MultiStepJobConfiguration.java :
        + Job 실행 -> Step1(tasklet1:로그출력)  -> Step2(tasklet2:로그출력) -> Step3(tasklet3:로그출력) -> 종료
*/
@Configuration
@RequiredArgsConstructor
public class MultiStepJobConfiguration {
    
    private final Logger logger = LoggerFactory.getLogger(MultiStepJobConfiguration.class);
    
    @Autowired
    private JobBuilderFactory jobBuilderFactory;;
    
    @Autowired
    private StepBuilderFactory stepBuilderFactory;
    
    private final String JOB_NAME = "multiStepJob";

    
    @Bean(JOB_NAME)
    public Job executeJob() {    
        return jobBuilderFactory.get(JOB_NAME)
                    .start(step1())
                    .next(step2())
                    .next(step3())                                
                    .build();
    }

    @Bean(name = JOB_NAME+"Step1")
    public Step step1() {    
        return stepBuilderFactory.get(JOB_NAME+"Step1")
                 .tasklet((contribution, chunkContext) -> {
                     
                     logger.debug("----------------------");
                     logger.debug(">>>>> This is "+JOB_NAME+".Step1");
                     logger.debug(">>>>> Job Params : " + chunkContext.getStepContext().getJobParameters());
                     logger.debug("----------------------");
                     
                     return RepeatStatus.FINISHED;
                 })
                 .build();
    }
    
    @Bean(name = JOB_NAME+"Step2")
    public Step step2() {    
        return stepBuilderFactory.get(JOB_NAME+"Step2")
                 .tasklet((contribution, chunkContext) -> {
                     
                     logger.debug("----------------------");
                     logger.debug(">>>>> This is "+JOB_NAME+".Step2");
                     logger.debug("----------------------");
                     
                     return RepeatStatus.FINISHED;
                 })
                 .build();
    }  
    
    @Bean(name = JOB_NAME+"Step3")
    public Step step3() {    
        return stepBuilderFactory.get(JOB_NAME+"Step3")
                 .tasklet((contribution, chunkContext) -> {
                     
                     logger.debug("----------------------");
                     logger.debug(">>>>> This is "+JOB_NAME+".Step3");
                     logger.debug("----------------------");
                     
                     return RepeatStatus.FINISHED;
                 })
                 .build();
    }
}
```

## 5. Job을 실행시킬 Scheduler Class 작성

```java
/*
    @DemoMultiStepJobScheduler.java : 
        + 매분 10초에 multiStepJob 을 실행시킬 Scheduler
*/
@RequiredArgsConstructor
@Component
public class DemoMultiStepJobScheduler {
    
    private final Logger logger = LoggerFactory.getLogger(DemoMultiStepJobScheduler.class);
    
    private final JobLauncher jobLauncher;
    private final MultiStepJobConfiguration jobConfig;
    
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
        
            jobLauncher.run(jobConfig.executeJob(), jobParams);            

        } catch (JobInstanceAlreadyCompleteException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (JobParametersInvalidException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (Exception e) {
            // TODO Auto-generated catch block
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

![]({{ site.baseurl }}/assets/images/post/spring/boot_batch2_06.png){: style="width:700px" .image_box}


## 7. Batch 데이타 확인
 > + batch_job_instance, batch_job_execution, batch_job_execution_params, batch_step_execution 의 데이타 확인    
 > + 이 웹화면은 Batch 모니터링을 위해 직접 개발한 것으로, Batch 테이블의 데이타는 DB 조회로 직접 확인
 > + 스케줄러에 정의한 대로 매분 10초에 multiStepJob 실행

![]({{ site.baseurl }}/assets/images/post/spring/boot_batch2_07.png){: style="width:700px" .image_box}    

