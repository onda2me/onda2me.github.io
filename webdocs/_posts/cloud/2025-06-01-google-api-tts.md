---
title: "구글 Text To Speech API를 활용한 TTS 서비스 구축"
categories: 
  - google
tags:
  - google
  - api
  - tts
header:
  teaser: /assets/images/post/cloud/speech-01.png
toc: true
toc_label: "구글 Text To Speech"
toc_icon: "list"  
---

## 1. 구글 Text to Speech?  

> 구글 클라우드 **텍스트음성 변환(TTS: Text to Speech)**은 Google AI 기술을 기반으로 한 Text To Speech API를 사용하여 텍스트를 음성으로 변환합니다.
{: .notice--info}

## 2. Text To Speech 서비스

### 1) 서비스 개요
  + 서비스 구성    
  ![Text To Speech 서비스 구성 ]({{ site.baseurl }}/assets/images/post/cloud/speech-01.png){: style="width:600px" .image_box}

  + UI 화면    
  ![Text To Speech UI ]({{ site.baseurl }}/assets/images/post/cloud/speech-02.png){: style="width:600px" .image_box}  

### 2) Google Cloud CLI 다운로드 및 설치

  +  Google Cloud CLI 다운로드 

      [다운로드 바로가기: https://cloud.google.com/sdk/docs/install-sdk](https://cloud.google.com/sdk/docs/install-sdk){: .btn.btn--primary.btn--narrow target="_blank" }  
  
  +  Google Cloud CLI 설치    
  ![Google Cloud CLI]({{ site.baseurl }}/assets/images/post/cloud/speech-11.png){: style="width:600px" .image_box}


### 3) Google Project 생성 및 선택 

  +  Google Project 선택    
  ![Google Cloud CLI]({{ site.baseurl }}/assets/images/post/cloud/speech-21.png){: style="width:600px" .image_box}

  + 설치확인 명령어
  ```batch
  gcloud --version
  ```

  + 설치확인 결과    
  ![Google Cloud CLI]({{ site.baseurl }}/assets/images/post/cloud/speech-22.png){: style="width:500px" .image_box}

### 4) Google CLI 실행

  + Google CLI 실행 명령어    
    ```batch
  gcloud init
  ```

 + Google CLI 실행 결과    
  ![Google Cloud CLI]({{ site.baseurl }}/assets/images/post/cloud/speech-31.png){: style="width:600px" .image_box}

 + Google CLI 웹 인증    
  ![Google Cloud CLI]({{ site.baseurl }}/assets/images/post/cloud/speech-33.png){: style="width:600px" .image_box}

### 5) Java Project 설정

  + @pom.xml 설정 추가    

  ```xml
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>com.google.cloud</groupId>
        <artifactId>libraries-bom</artifactId>
        <version>26.1.4</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>
    </dependencies>
  </dependencyManagement>

  <dependencies>
    <dependency>
      <groupId>com.google.cloud</groupId>
      <artifactId>google-cloud-texttospeech</artifactId>
    </dependency>
  </dependencies>   
   ```

  + Controller 추가    

  ```java

  public class TTSAPIController {

    @RequestMapping(value="/tospeech")               
    public int speech(@RequestParam HashMap<String, String> paramMap) throws Exception { 
        
        int len = 0;        
        if(paramMap.get("contents") != null) {
            String lngCode = "ko-KR";
            String fileName = "speech-ko-KR.mp3";
            
            len = synthesizeText(
                    paramMap.get("contents").toString(), lngCode, fileName, "speech/"
                  ).size();
        }
                
        return len;
    }

    public static ByteString synthesizeText(String contents, String lngCode, String fileName, String filePath ) throws IOException {
        ByteString audioContents = null;
        OutputStream out = null;
        try {
            
          TextToSpeechClient textToSpeechClient = TextToSpeechClient.create();
        
          // Set the text input to be synthesized
          SynthesisInput input = SynthesisInput.newBuilder().setText(contents).build();
  
          // Build the voice request
          VoiceSelectionParams voice =
              VoiceSelectionParams.newBuilder()
                  .setLanguageCode(lngCode) // languageCode = en-US / ko-KR
                  .setSsmlGender(SsmlVoiceGender.FEMALE) // ssmlVoiceGender = SsmlVoiceGender.MALE / FEMALE
                  .build();

          // Select the type of audio file you want returned
          AudioConfig audioConfig =
              AudioConfig.newBuilder()
                  .setAudioEncoding(AudioEncoding.MP3) // MP3 audio.
                  .build();

          // Perform the text-to-speech request
          SynthesizeSpeechResponse response =
              textToSpeechClient.synthesizeSpeech(input, voice, audioConfig);

          // Get the audio contents from the response
          audioContents = response.getAudioContent();
          //logger.info("Audio written size: "+audioContents.size());
           
          // save audio file 
          out = new FileOutputStream(new File(filePath+fileName));
          out.write(audioContents.toByteArray());
          out.flush(); 
                   
        } finally {
            if(out != null) out.close();
        }
        
        return audioContents;
    } 
  }  
   ```

<!-- 
### 3. 솔루션 요약
  1. 웹 클라이언트는 Firebase 호스팅에서 호스팅됩니다.
  2. 웹 클라이언트는 Cloud Run 서비스로 실행되고 Python으로 작성된 API 백엔드를 호출합니다.
  3. Python 애플리케이션의 구성 및 기타 보안 비밀이 Cloud Secrets Manager에 저장됩니다.
  4. PostgreSQL용 CloudSQL은 Python 애플리케이션의 관계형 데이터베이스 백엔드로 사용됩니다.
  5. 애플리케이션의 정적 애셋과 컨테이너 이미지는 Cloud Storage에 저장됩니다.

> Google Cloud Run은 아래 그림과 같이 Springboot 동적 웹서비스도 가능하지만, Cloud Run은 빌드 -> 배포의 과정이 번거롭고, 페이지 호출 시 CPU 사용량에 따라 요금이 부과되는 유료 서비스이기에 요금 절약을 위해 Onda2Me 서비스를 Front (= Firebase)와 Back (= Cloud Run) 기능을 분리하여 재구성하였다.
{: .notice--info}
-->

## 3. Text To Speech 서비스 보완

### 1) 서비스 보완의 이유
  > Google Cloud TTS API를 이용해서 생성한 audio 파일은 일반적인 서버에서는 파일로 바로 저장이 가능하지만, Backend Google Cloud Run 서버에는 저장이 불가능하다. 따라서 파일 생성 위치를 Google Storage로 변경하는 과정이 필요하다.
  Google Storage에 audio 파일을 저장하고, 이를 웹에서 streaming 하기 위해서는 복잡한 GCloud 설정 과정이 필요하다.
{: .notice--info}


+ Google Cloud TTS 서비스 요약
  1. cloud run 서비스가 Storage에 파일을 저장할 수 있는 권한 설정
  2. storage에 upload 할 bucket 생성
  3. upload용 bucket을 웹에서 접근가능하도록 public 권한 설정

### 2) 서비스 개요
  + 서비스 구성    
  ![Text To Speech 서비스 구성 ]({{ site.baseurl }}/assets/images/post/cloud/speech-41.png){: style="width:600px" .image_box}

### 3) Java Project 수정

  + Controller 수정    

  ```java

  public class TTSAPIController {

    // 버킷 이름: mybucket
    // 접근 허용할 폴더 (prefix): upload/tts/
    // 접근 허용 대상: user@example.com
    // 역할: roles/storage.objectViewer
    public static void uploadStorage(
        String projectId, String bucketName, String fileName, String filePath, ByteString audioContents) throws IOException {
        
        Storage storage = StorageOptions.newBuilder().setProjectId(projectId).build().getService();
        BlobId blobId = BlobId.of(bucketName, filePath+fileName);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId).build();
        byte[] content = audioContents.toByteArray();
        
        try (WriteChannel writer = storage.writer(blobInfo)) {
          writer.write(ByteBuffer.wrap(content));

          logger.debug(
              "Wrote to " + filePath + fileName + " in bucket " + bucketName + " using a WriteChannel.");
        }
    }
  }  

   ```

## + 참고

### 1. 참고 사이트

+ 구글 클라우드 TTS 가이드 [바로가기](https://cloud.google.com/text-to-speech/docs/basics){: .btn.btn--primary.btn--narrow target="_blank" }


### 2. 데모 사이트

+ 구글 클라우드 TTS 적용 데모사이트 [바로가기](https://ondago365.web.app/play/text-to-speech.html){: .btn.btn--primary.btn--narrow target="_blank" }




