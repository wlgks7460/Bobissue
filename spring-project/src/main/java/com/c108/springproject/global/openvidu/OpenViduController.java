package com.c108.springproject.global.openvidu;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/openvidu")
public class OpenViduController {

    private final OpenViduService openViduService;

    public OpenViduController(OpenViduService openViduService) {
        this.openViduService = openViduService;
    }

    // 1️⃣ OpenVidu 세션 생성 API
    @PostMapping("/sessions")
    public String createSession() {
        System.out.println("호출 완료");
        return openViduService.createSession();
    }

    // 2️⃣ OpenVidu 토큰 생성 API
    // ✅ 2. 토큰 발급 API
    @PostMapping("/sessions/{sessionId}/connections")
    public String createToken(@PathVariable String sessionId) {
        String token = openViduService.createToken(sessionId);
//        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_COUPON, new DefaultResponse<String>(token));
        return  token;
    }
}
