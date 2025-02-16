package com.c108.springproject.global.openvidu;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Service
public class OpenViduService {

    private static final String OPENVIDU_URL = "https://bobissue.store/openvidu/api";
    private static final String OPENVIDU_USERNAME = "OPENVIDUAPP";
    private static final String OPENVIDU_SECRET = "C108bob";
    private final RestTemplate restTemplate;

    public OpenViduService() {

        this.restTemplate = new RestTemplate();
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth(OPENVIDU_USERNAME, OPENVIDU_SECRET);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public String createSession() {
        HttpHeaders headers = createHeaders();
        Map<String, Object> body = Collections.singletonMap("customSessionId", "mySession3");  // 원하는 세션 ID 설정
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    OPENVIDU_URL + "/sessions", HttpMethod.POST, request, String.class);

            System.out.println("✅ 세션 생성 성공! 응답: " + response.getBody());
            return response.getBody();
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            System.out.println("❌ 오류 발생: " + e.getResponseBodyAsString());
            return e.getMessage();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // 2️⃣ OpenVidu 토큰 생성
    public String createToken(String sessionId) {
        HttpHeaders headers = createHeaders();
        Map<String, Object> body = new HashMap<>();
        body.put("session", sessionId);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                OPENVIDU_URL + "/tokens", HttpMethod.POST, request, String.class);
        // 토큰 값을 로그로 출력하여 확인
        String token = response.getBody();
        System.out.println("✅ 생성된 OpenVidu 토큰: " + token);
        return response.getBody();
    }

}
