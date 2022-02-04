---
title:  "Apache POI를 이용한 엑셀 다운로드 기능"
categories: 
  - java
tags:
  - java
  - 엑셀

---

서비스 운영을 하다보면 한달간, 연간 운영현황을 파악하기 위한 운영리포트 기능이 필요한 경우가 있다.    
이글은 Apache POI 라이브러리를 이용하여 데이타 및 그래프를 포함한 엑셀파일을 생성하는 방법에 대한 글이다.    

> 엑셀파일 샘플 (판매현황_202110_리포트.xls)    

![]({{ site.baseurl }}/assets/images/post/sw/poi_00.png){: style="width:500px"}


#### 1.Apache POI 3.9 다운로드

+ pom.xml 파일에 dependency 추가
```bash
  # 메이븐 프로젝트는 pom.xml 파일에 dependency 추가

		<!-- https://mvnrepository.com/artifact/org.apache.poi/poi -->
		<dependency>
		    <groupId>org.apache.poi</groupId>
		    <artifactId>poi</artifactId>
		    <version>3.9</version>
		</dependency>
```    

+ 라이브러리 직접 다운로드     
[https://mvnrepository.com/artifact/org.apache.poi/poi](https://mvnrepository.com/artifact/org.apache.poi/poi)    
![]({{ site.baseurl }}/assets/images/post/sw/poi_01.png){: style="width:500px"}

#### 2. 엑셀 Template파일 생성
엑셀이 출력될 포맷의 template 파일을 생성한다.    
그래프영역은 데이타영역의 데이타를 읽어서 자동으로 보여줄수 있도록 구성한다.    
![]({{ site.baseurl }}/assets/images/post/sw/poi_02.png){: style="width:500px"}

아래 그림과 같이 그래프의 속성에서 차트 종류, 색상, 읽어들일 데이타의 값을 지정할 수 있다.     
![]({{ site.baseurl }}/assets/images/post/sw/poi_02_1.png){: style="width:500px"}

#### 3. 데이타 출력부분 데이타 코딩

+ Controller의 엑셀 다운로드 부분
```java
// 데이터를 추출하여 ExcelView에 전달한다. 
@RequestMapping(value = "/test/excelReport.co") 
public ExcelView excelReport(Model model) { 
	
	// 차트를 만들기 위한 통계자료 
	List<Map<String, Object>> listStat = new ArrayList<Map<String, Object>>();		
	Map<String, Object> mapStat = null; 		
	
	// 통계자료 공통정보
	String excelTitle = "판매현황";
	String inputYear = "2021";
	String inputMonth = "10";
	
	// 월합계 데이타 저장변수
	int sumCount = 0;
	int sumMember = 0;
	
	// 가상데이타 생성위한 랜덤변수
	Random rnd = new Random();
	
	// 예제를 위해 한달 1일 ~ 30일까지 가상 데이타 생성 및 저장
	// 실제는 DB또는 Json 연동으로 Data를 읽어서 처리한다.
	for(int i=1; i<=30; i++) {
		
		mapStat = new HashMap<String, Object>();
		mapStat.put("date", (i < 10 ? "0"+i : i)); 
		mapStat.put("count", rnd.nextInt(100)); 
		mapStat.put("member", rnd.nextInt(50)); 	
		listStat.add(mapStat); 
		
		sumCount += Integer.parseInt(mapStat.get("count").toString());
		sumMember += Integer.parseInt(mapStat.get("member").toString());
	}

	// 리스트 데이터 저장 
	model.addAttribute("stat", listStat); 

	// 통계정보
	model.addAttribute("title", excelTitle); 
	model.addAttribute("year", inputYear); 
	model.addAttribute("month", inputMonth);		
		
	// 합계
	Map<String, Object> mapSum = new HashMap<String, Object>(); 
	mapSum.put("count", sumCount); 
	mapSum.put("member", sumMember); 
	model.addAttribute("sum", mapSum);  
	
	// 일평균
	Map<String, Object> mapAvg = new HashMap<String, Object>(); 
	mapAvg.put("count", new Double (sumCount/30)); 
	mapAvg.put("member", new Double(sumMember/30)); 
	model.addAttribute("avg", mapAvg); 		
	

	
	// 엑셀 출력
	return new ExcelView(excelTitle+"_"+inputYear+inputMonth+"_리포트", "excel_template_test.xls");		
}
```

+ ExcelView의 엑셀 템플릿에 데이타 맵핑 부분   
```java
public class ExcelView extends AbstractExcelView { 

	@Override 
	protected void buildExcelDocument(
			Map<String, Object> data, 
			HSSFWorkbook workbook, 
			HttpServletRequest request, 
			HttpServletResponse response) throws Exception { 
			
		response.setHeader("Content-Type", "application/octet-stream"); 
		response.setHeader("Content-Disposition", 
				"attachment; filename="+java.net.URLEncoder.encode(fileName, "UTF-8")+".xls");
		
		OutputStream os = null; 
		InputStream is = null; 
		try { 
			
			// 엑셀 템플릿 파일이 존재하는 위치  		
			// E:\eclipse\workspace\project\src\main\webapp\statics\template
			String templatePath = ConfigUtil.getString("template-dir");

			// template 파일을 읽는다.
			is = new FileInputStream(templatePath + templateName);
			os = response.getOutputStream();
			
			// XLSTransformer를 이용하여 Controller의 data를 읽어 template파일에 맵핑시킨다.
			XLSTransformer transformer = new XLSTransformer(); 
			Workbook excel = transformer.transformXLS(is, data); 
			
			os.flush();
			excel.write(os); 
			os.flush();
			
			
		} catch (IOException e) { 
			e.printStackTrace(); 
			
			throw new RuntimeException(e.getMessage()); 
		} finally {
			
			if(os != null) try { os.close(); } catch (IOException e) { } 
			if(is != null) try { is.close(); } catch (IOException e) { } 
		} 
	}
}	
```

#### 4. 웹페이지 접속하여 엑셀파일 다운로드
Controller에서 정의한 주소로 접속하여 엑셀파일을 다운로드 한다.    
(예시: [http://localhost:8080/test/excelReport.co](http://localhost:8080/test/excelReport.co))

![]({{ site.baseurl }}/assets/images/post/sw/poi_03.png)


**Note:** DB나 json 연동으로 가져온 데이타를 Apache poi를 이용하여 데이타와 차트가 포함된 excel 파일로 다운로드 받을수 있는 프로그램 소스는 [[GitHub]](https://github.com/onda2me/algorithm/tree/main/src/com/onda2me/algorithm/apache/poi){: .btn.btn--primary.btn--narrow target="_blank" } 에서 다운로드 받을 수 있다.
{: .notice--info}
