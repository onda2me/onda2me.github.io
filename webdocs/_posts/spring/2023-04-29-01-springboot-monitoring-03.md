---
title: "SpringBoot Batch Monitoring System (3/3)"
categories: 
  - springboot
tags:
  - springboot
  - monitoring
  - batch
  - thymeleaf
header:
  teaser: /assets/images/post/spring/boot_monitoring_01.png  
---

# 배치 모니터링 시스템 만들기 - 3단계 모니터링 UI 작성

> #### 1단계 기본환경 설정  
+ 프로젝트 생성 [글보기](/springboot/01-springboot-monitoring-01/){: .btn.btn--info.btn--small target="_blank" }
+ Application properties 설정
+ Thymeleaf 설정
+ welcome 페이지 생성  
{: .notice} 

> #### 2단계 배치 생성  
+ 배치 메타 테이블 생성 [글보기](/springboot/01-springboot-monitoring-02/){: .btn.btn--info.btn--small target="_blank" }
+ 배치 클래스 생성
+ 배치 실행 스케줄러 생성
{: .notice} 

> #### [▶](#){: .btn .btn--primary.btn--small}  3단계 모니터링 UI 작성  
+ Controller 클래스 생성 [글보기](/springboot/01-springboot-monitoring-03/){: .btn.btn--info.btn--small target="_blank" }
+ Service 클래스 생성
+ Mapper 클래스 생성 
+ mapper.xml (MySQL query) 생성
+ Html 파일 생성
{: .notice} 

---

모니터링 UI는 총 3개의 페이지로 구성하였다.
+ @/batch/jobList  : Job 목록    
+ @/batch/jobDetail : Job 상세 + Step 목록     
+ @/batch/stepDetail : Step 상세

## 1. Controller 클래스 생성
> @BatchViewController.java   

```java
@Controller
@RequestMapping("/batch")
public class BatchViewController {
  
  private static final Logger logger = LoggerFactory.getLogger(BatchViewController.class);
  
  @Resource
  private BatchService batchService;
  
  /**
   * Job 목록 조회 : /batch/jobList
   * @param model
   * @param paramMap
   * @param pgtl
   * @return
   */
  @RequestMapping(value = "/jobList", method = RequestMethod.GET)
  public String list(Model model, @RequestParam HashMap<String, Object> paramMap, PageUtil pgtl) {
    
    String todayDate = DateUtil.getDate("yyyy-MM-dd");
    
    logger.debug("----------------------------------------------------");
    logger.debug("/batch/jobList");
    logger.debug("paramMap : " + paramMap);   
    logger.debug("----------------------------------------------------");
        
    //------------------------------------------------------------------------
    // SearchMap Init : 검색 조건 설정
    //------------------------------------------------------------------------
    SearchMap searchMap = new SearchMap(paramMap);
    searchMap.initParam("status", "COMPLETED");
    searchMap.initParam("jobName", "");
    searchMap.initParam("startDate", todayDate);
    searchMap.initParam("endDate", todayDate);
    
    //------------------------------------------------------------------------
    // pageLink init : 페이징 설정
    //------------------------------------------------------------------------
    int total = batchService.listCount(searchMap);
    pgtl.init(total, "/batch/jobList", searchMap.getParams());
    searchMap.setPgtl(pgtl);
      
    List<BatchJobInstanceEntity> list = batchService.list(searchMap);
    
    model.addAttribute("list", list);
    model.addAttribute("searchMap", searchMap);
    model.addAttribute("statusList", status);
    return "/html/batch/jobList";    
  }
  
  /**
   * Job 상세 조회 : /batch/jobDetail
   * @param model
   * @param paramVo
   * @return
   */
  @RequestMapping(value = "/jobDetail", method = RequestMethod.GET)
  public String jobDetail(Model model, BatchJobInstanceEntity paramVo) {
    
    BatchJobInstanceEntity job = null;
    List<BatchStepExecutionEntity> steps = null;
    
    job = batchService.selectJobDetail(paramVo.getInstanceId());
    
    if(job.getExec() != null) {
      steps = batchService.listStepDetail(job.getExec().getExecutionId());
    }
    
    model.addAttribute("job", job);
    model.addAttribute("steps", steps);
    
    return "/html/batch/jobDetail";    
  }  
  
  /**
   * Step 상세 조회 : /batch/stepDetail
   * @param model
   * @param paramVo
   * @return
   */
  @RequestMapping(value = "/stepDetail", method = RequestMethod.GET)
  public String stepDetail(Model model, BatchJobExecutionEntity paramVo) {
    
    BatchJobExecutionEntity job = batchService.selectStepDetail(paramVo.getExecutionId());
    
    model.addAttribute("job", job);
    return "/html/batch/stepDetail";    
  }  
}
```
## 2. Service 클래스 생성
> @BatchService.java      

```java
@Service("com.onda2me.app.service")
public class BatchService {

  @Autowired 
  private BatchMapper batchMapper;
  
  public BatchService(BatchMapper batchMapper) {
    this.batchMapper = batchMapper;
  }
  public int listCount(HashMap<String, Object> map) {
    
    return batchMapper.listCount(map);
  }
  public List<BatchJobInstanceEntity> list(HashMap<String, Object> map) {
    
    return batchMapper.list(map);
  }
  public BatchJobInstanceEntity selectJobDetail(int id) {
  
    return batchMapper.selectJobDetail(id);
  }
  public BatchJobExecutionEntity selectStepDetail(int id) {
    
    return batchMapper.selectStepDetail(id);
  }  
  public List<BatchStepExecutionEntity> listStepDetail(int id) {
    
    return batchMapper.listStepDetail(id);
  }  
}
```

## 3. Mapper 클래스 생성
> @BatchMapper.java    

```java
package com.onda2me.app.mapper;
/*
    BatchMapper.java :    mybatis SQL 호출 인터페이스    
*/
@MapperScan("com.onda2me.app.mapper")
public interface BatchMapper {

  public int listCount(HashMap map);
  
  public List<BatchJobInstanceEntity> list(HashMap<String, Object> map);
  
  public BatchJobInstanceEntity selectJobDetail(int id);  
  
  public BatchJobExecutionEntity selectStepDetail(int id);
  
  public List<BatchStepExecutionEntity> listStepDetail(int id);
}
```
## 4. mapper.xml 생성
> @batch-mapper.xml    

```xml
<mapper namespace="com.onda2me.app.mapper.BatchMapper">
  <!--BatchJobInstance : batch_job_instance table -->
  <resultMap id="instanceResultMap" type="BatchJobInstanceEntity">
    <id property="instanceId" column="job_instance_id" />
    <result property="version" column="version"/>          
    <result property="jobName" column="job_name"/>
    <result property="jobKey" column="job_key"/>
    
    <association property="exec" resultMap="executionResultMap" />
    <collection property="execParams" ofType="BatchJobExecutionParamsEntity" resultMap="paramsResultMap" />
  </resultMap>
  
  <!--BatchJobExecution : batch_job_execution table -->
  <resultMap id="executionResultMap" type="BatchJobExecutionEntity">
    <id property="executionId" column="job_execution_id"/>
    <result property="version" column="version"/>
    <result property="instanceId" column="job_instance_id"/>
    <result property="createTime" column="create_time"/>
    <result property="startTime" column="start_time"/>
    <result property="endTime" column="end_time"/>
    <result property="status" column="status"/>
    <result property="exitCode" column="exit_code"/>
    <result property="exitMessage" column="exit_message"/>
    <result property="updateTime" column="last_updated"/>    
    
    <collection property="steps" ofType="BatchStepExecutionEntity" resultMap="stepResultMap" />    
  </resultMap>
  
  <!--BatchJobExecutionParams : batch_job_execution table -->        
  <resultMap id="paramsResultMap" type="BatchJobExecutionParamsEntity">
    <id property="primaryKey.executionId" column="job_execution_id" />
    <id property="primaryKey.keyName" column="key_name" />
    
    <result property="executionId" column="job_execution_id"/>         
    <result property="typeCd" column="type_cd"/>
    <result property="keyName" column="key_name"/>
    <result property="stringVal" column="string_val"/>
    <result property="dateVal" column="date_val"/>
    <result property="longVal" column="long_val"/>
    <result property="doubleVal" column="double_val"/>
    <result property="identifying" column="identifying"/>         
  </resultMap>
  
  <!--BatchStepExecution : batch_job_execution table -->
  <resultMap id="stepResultMap" type="BatchStepExecutionEntity">
    <id property="stepId" column="step_execution_id" />
              
    <result property="version" column="version"/>         
    <result property="stepName" column="step_name"/>
    <result property="executionId" column="job_execution_id"/>
    <result property="startTime" column="start_time"/>
    <result property="endTime" column="end_time"/>
    <result property="status" column="status"/>
    <result property="commitCount" column="commit_count"/>
    <result property="readCount" column="read_count"/>
    <result property="filterCount" column="filter_count"/>
    <result property="writeCount" column="write_count"/>
    <result property="readSkipCount" column="read_skip_count"/>
    <result property="writeSkipCount" column="write_skip_count"/>
    <result property="processSkipCount" column="process_skip_count"/>
    <result property="rollbackCount" column="rollback_count"/>
    <result property="exitCode" column="exit_code"/>
    <result property="exitMessage" column="exit_message"/>
    <result property="updateTime" column="last_updated"/>  
    <result property="jobConfigurationLocation" column="job_configuration_location"/>      
  </resultMap>

  <sql id="commonPagingHeader"> SELECT R1.* FROM ( </sql>        
  <sql id="commonPagingFooter"> ) R1 LIMIT #{pgtl.startNo}, #{pgtl.listPerPage} </sql>

  <select id="listCount" parameterType="com.onda2me.app.common.SearchMap"  resultType="int">            
      SELECT count(j.job_instance_id) as cnt
      FROM batch_job_instance j, batch_job_execution e left join batch_job_execution_params p
      ON e.job_execution_id = p.job_execution_id and p.key_name = 'channel'
      WHERE j.job_instance_id = e.job_instance_id
      <if test="executionId > 0"> and e.job_execution_id = #{executionId} </if> 
      <if test="jobName != null and jobName != ''"> and j.job_name like concat('%', #{jobName}, '%')</if> 
      <if test="startDate != null and startDate != ''"> and create_time between concat(#{startDate}, ' 00:00:00') and concat(#{endDate}, ' 23:59:59') </if>
      <!-- 
      <if test="startTime != null"> and start_time = #{startTime} </if>             
      <if test="endTime != null"> and end_time = #{endTime} </if> -->
      <if test="status != null and status != ''"> and status = #{status} </if>
  </select>
          
  <select id="list" parameterType="com.onda2me.app.common.SearchMap"  resultMap="instanceResultMap">             
    <if test="pgtl != null"><include refid="commonPagingHeader" /></if>
      SELECT 
        j.job_instance_id, j.job_name, 
        e.job_execution_id, e.version, e.create_time, e.start_time, e.end_time, e.status, e.exit_code, e.exit_message, e.last_updated,
        p.type_cd, p.key_name, p.string_val, p.date_val, p.long_val, p.double_val, p.identifying
      FROM batch_job_instance j, batch_job_execution e left join batch_job_execution_params p
      ON e.job_execution_id = p.job_execution_id and p.key_name = 'channel'
      WHERE j.job_instance_id = e.job_instance_id
      <if test="executionId > 0"> and e.job_execution_id = #{executionId} </if> 
      <if test="jobName != null and jobName != ''"> and j.job_name like concat('%', #{jobName}, '%')</if> 
      <if test="startDate != null and startDate != ''"> and create_time between concat(#{startDate}, ' 00:00:00') and concat(#{endDate}, ' 23:59:59') </if>
      <if test="status != null and status != ''"> and status = #{status} </if>
      order by j.job_instance_id desc, e.job_execution_id desc, p.key_name asc           
    <if test="pgtl != null"><include refid="commonPagingFooter" /></if>
  </select>
      
  <select id="selectJobDetail" parameterType="int"  resultMap="instanceResultMap">              
      SELECT 
        j.job_instance_id, j.job_name, j.job_key, 
        e.job_execution_id, e.version, e.create_time, e.start_time, e.end_time, e.status, e.exit_code, e.exit_message, e.last_updated,
        p.type_cd, p.key_name, p.string_val, p.date_val, p.long_val, p.double_val, p.identifying
      FROM batch_job_instance j, batch_job_execution e left join batch_job_execution_params p
      ON e.job_execution_id = p.job_execution_id
      WHERE j.job_instance_id = e.job_instance_id and e.job_instance_id = #{instanceId}  
      order by job_instance_id desc, e.job_execution_id desc, p.key_name asc     
  </select>
  
  <select id="selectStepDetail" parameterType="int"  resultMap="executionResultMap">              
      SELECT 
        j.job_instance_id, j.job_name, 
        e.job_execution_id, e.version, e.create_time, e.start_time, e.end_time, e.status, e.exit_code, e.exit_message, e.last_updated,
        s.*
      FROM batch_job_instance j, batch_job_execution e left join batch_step_execution s
      ON e.job_execution_id = s.job_execution_id
      WHERE j.job_instance_id = e.job_instance_id and e.job_execution_id = #{executionId}        
  </select> 
  
  <select id="listStepDetail" parameterType="int" resultMap="stepResultMap">              
      SELECT 
        s.*
      FROM batch_step_execution s
      WHERE s.job_execution_id = #{executionId}        
  </select>  
</mapper>
```

## 5. html 파일 생성
@jobList.html    

```html    
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org"
      xmlns:layout="http://www.ultraq.net.nz/thymeleaf/layout"
      layout:decorate="~{/layouts/layout-dev}">
     
<th:block layout:fragment="content">        
    <form name="frm" action="/batch/jobList" method="get">        
    <div class="row main-head ">
      <div class="col-4 p-0 main-title "> 
        Batch List
      </div> 
      <div class="col-8 p-0 main-toolbar ">        
        <div class="input-group">          
          <select class="form-select" name="status">
            <option selected value="">Status ALL</option>
            <option th:each="vo : ${statusList}" th:value="${vo.name()}" th:text="${vo.name()}" th:selected="${#strings.equals(vo.name(), searchMap.status)}"></option>
          </select>
          <input type="text" class="form-control form-control-sm mx-2 border" name="jobName" placeholder="JobName" aria-label="jobName" th:value="${searchMap.jobName}"/>                
          <input type="date" class="form-control form-control-sm " name="startDate" th:value="${searchMap.startDate}" />
          <span class="px-2">~</span>
          <input type="date" class="form-control form-control-sm " name="endDate"  th:value="${searchMap.endDate}" />
          <button class="btn btn-sm btn btn-primary" onclick="goSubmit()"><span class="fa fa-search fs--1"></span></button>
        </div>
      </div> 
    </div>
    <div class="table-responsive portlet scrollbar">    
        <table class="table table-sm table-hover tb-success">
          <thead>
            <tr class="text-center text-800">
              <th class="sort white-space-nowrap" data-sort="no">#</th>
              <th class="sort white-space-nowrap" data-sort="instanceId">insId</th>
              <th class="sort white-space-nowrap" data-sort="excutionId">exeId</th>
              <th class="sort white-space-nowrap" data-sort="ver">ver</th>
              <th class="sort white-space-nowrap" data-sort="jobName">jobName</th>
              <th class="sort white-space-nowrap" data-sort="channel">channel</th>
              <th class="sort white-space-nowrap" data-sort="status">status</th>
              <th class="sort white-space-nowrap" data-sort="exitCode">exitCode</th>
              <th class="sort white-space-nowrap" data-sort="createTime">createTime</th>
              <th class="sort white-space-nowrap" data-sort="updateTime">updateTime</th>
              <th class="no-sort white-space-nowrap">Actions</th>
           </tr>
         </thead>
          <tbody class="list" id="table-orders-body">
          <th:block th:if="${!#lists.isEmpty(list)}">
          <tr th:each="job, i : ${list}" class="btn-reveal-trigger align-middle text-center">
              <td class="no" style="width: 28px;" th:text="${searchMap.pgtl.getSeqNo(i.count)}">0</td>
              <td class="instanceId"><a th:href="@{/batch/jobDetail(instanceId=${job.instanceId})}" class="prd-link" th:text="${job.instanceId}"></a></td>
              <td class="excutionId" th:text="${job.exec.executionId}"></td>
              <td class="ver" th:text="${job.version}"></td>
              <td class="jobName" th:text="${job.jobName}"></td>
              <td class="channel" th:text="${job.execParams.get(0).stringVal}"></td>
              <td class="status"><span th:attr="class=${job.exec.isStatusComplete ? 'badge bg-secondary' : 'badge bg-warning'}">
                  <span th:text="${job.exec.status}"></span>
                </span>            
              </td>
              <td class="exitCode">
              <span th:attr="class=${job.exec.isExitComplete ? 'badge bg-secondary' : 'badge bg-warning'}">
                <span th:text="${job.exec.exitCode}"></span>
              </span>
              </td>
              <td class="createTime" th:text="${@DateUtil.getDateTimeFormat(job.exec.createTime)}"></td>
              <td class="updateTime" th:text="${@DateUtil.getDateTimeFormat(job.exec.updateTime)}"></td>
              <td class="">-</td>
            </tr>          
            </th:block>
          </tbody>
        </table>
        <th:block th:utext="${searchMap.pgtl.printPageList}"></th:block>
    </div>
  </form>
</th:block>
</html>
```
## 6. 웹에서 확인

@/batch/jobList     
![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_21.png){: style="width:700px" .image_box}  

@/batch/jobDetail    
![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_22.png){: style="width:700px" .image_box}  

@/batch/stepDetail    
![]({{ site.baseurl }}/assets/images/post/spring/boot_monitoring_23.png){: style="width:700px" .image_box}  


[배치 모니터링 시스템 다운로드 받기](https://github.com/onda2me/onda-batch-monitoring){: .btn.btn--info.btn--small target="_blank" }

---

### Reference
+ [spring.io](https://spring.io/guides/gs/batch-processing/){: target="_blank" }
+ [Mybatis Result Maps](https://mybatis.org/mybatis-3/ko/sqlmap-xml.html#Result_Maps){: target="_blank" }




