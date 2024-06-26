---
title: "SpringBoot Batch Monitoring System (2/3)"
categories: 
  - springboot
tags:
  - springboot
  - monitoring
  - batch
  - thymeleaf
header:
  teaser: /assets/images/post/spring/boot_monitoring_02.png  
---

# 배치 모니터링 시스템 만들기 - 2단계 배치생성

> #### 1단계 기본환경 설정  
+ 프로젝트 생성 [글보기](/springboot/01-springboot-monitoring-01/){: .btn.btn--info.btn--small target="_blank" }
+ Application properties 설정
+ Thymeleaf 설정
+ welcome 페이지 생성  
{: .notice} 

> #### [▶](#){: .btn .btn--primary.btn--small}  2단계 배치 생성  
+ 배치 메타 테이블 생성 [글보기](/springboot/01-springboot-monitoring-02/){: .btn.btn--info.btn--small target="_blank" }
+ 배치 클래스 생성
+ 배치 실행 스케줄러 생성
{: .notice} 

> #### 3단계 모니터링 UI 작성  
+ Controller 클래스 생성 [글보기](/springboot/01-springboot-monitoring-03/){: .btn.btn--info.btn--small target="_blank" }
+ Service 클래스 생성
+ Mapper 클래스 생성 
+ mapper.xml (MySQL query) 생성
+ Html 파일 생성
{: .notice} 

---
## 배치 메타데이타 테이블 이란?
스프링부트에서 배치를 실행하기 위해서는 배치 프로그램외에 배치 메타데이타 테이블이 필요하다.    

**메타데이타(Metadata)란 다른 데이타를 설명해 주는 정보들을 구조화 한 데이타**를 뜻하며 배치 메타데이타란 배치가 실행되는 정보를 저장하는 메타데이타를 의미한다.

즉, 배치를 실행하면 Job의 실행 정보 및 실행 Parameter, Step 실행 정보, Job과 Step의 실행결과 등을 메타 테이블에 저장되는데,  
이러한 메타 테이블은 MySQL DB를 사용하는 경우 직접 생성해 주어야 한다.    


> 배치 메타 테이블 생성 스크립트 위치    

메타 테이블 생성을 위한 스크립트는 스프링부트 spring-batch-core-version-x.x.x.jar 에 포함되어 있으며 /org/springframework/batch/core/ 폴더에 위치해 있다.
{: .notice}    

![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_12.png){: style="width:450px" .image_box}  



## 1. 배치 메타 테이블 생성

> 배치 메타테이블 데이타  
 
![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_00.png){: style="width:700px" .image_box}   

> 배치 메타테이블 ERD  

![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_02.png){: style="width:700px" .image_box}  


> 배치 메타 테이블 스크립트    

[배치 메타테이블 생성 스크립트 다운로드 받기](https://github.com/onda2me/onda-batch-monitoring/tree/main/src/main/resources/data){: .btn.btn--info.btn--small target="_blank" }

```sql
CREATE TABLE BATCH_JOB_INSTANCE  (
	JOB_INSTANCE_ID BIGINT  NOT NULL PRIMARY KEY ,  
	VERSION BIGINT ,  
	JOB_NAME VARCHAR(100) NOT NULL, 
	JOB_KEY VARCHAR(32) NOT NULL,
	constraint JOB_INST_UN unique (JOB_NAME, JOB_KEY)
) ENGINE=InnoDB;

CREATE TABLE BATCH_JOB_EXECUTION  (
	JOB_EXECUTION_ID BIGINT  NOT NULL PRIMARY KEY ,
	VERSION BIGINT  ,  
	JOB_INSTANCE_ID BIGINT NOT NULL,
	CREATE_TIME DATETIME NOT NULL,
	START_TIME DATETIME DEFAULT NULL , 
	END_TIME DATETIME DEFAULT NULL ,
	STATUS VARCHAR(10) ,
	EXIT_CODE VARCHAR(100) ,
	EXIT_MESSAGE VARCHAR(2500) ,
    JOB_CONFIGURATION_LOCATION varchar(2500),
	LAST_UPDATED DATETIME,
	constraint JOB_INST_EXEC_FK foreign key (JOB_INSTANCE_ID)
	references BATCH_JOB_INSTANCE(JOB_INSTANCE_ID)
) ENGINE=InnoDB;
... 이하 생략 ...
```


## 2. Job Configuration Class 작성

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

## 3. Job을 실행시킬 Scheduler Class 작성

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
## 4. SpringBootApplication 실행
> + 매분 10초에 로그 출력하는 Job 실행    

![]({{ site.baseurl }}/assets/images/post/spring/boot_batch_06.png){: style="width:700px" .image_box}

+ 다른 Batch 예제를 참고하고 싶으면 [3개의 Step을 가진 Job 글 참고](/springboot/01-springboot-batch-02/){: .btn.btn--info.btn--small target="_blank" }
{: .notice} 

---

### Reference
+ [spring.io](https://spring.io/guides/gs/batch-processing/){: target="_blank" }
+ [메타데이타](https://namu.wiki/w/%EB%A9%94%ED%83%80%EB%8D%B0%EC%9D%B4%ED%84%B0){: target="_blank" }




