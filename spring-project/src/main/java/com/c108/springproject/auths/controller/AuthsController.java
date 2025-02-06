package com.c108.springproject.auths.controller;

import com.c108.springproject.auths.dto.request.LoginReqDto;
import com.c108.springproject.auths.service.AuthsService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.global.jwt.JwtTokenProvider;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.dto.KakaoReqDto;
import com.c108.springproject.user.dto.NaverReqDto;
import com.c108.springproject.user.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auths")
public class AuthsController {

    private final AuthsService authsService;
    private final UserService userService;
    private JwtTokenProvider jwtTokenProvider;

    public AuthsController(AuthsService authsService, UserService userService) {
        this.authsService = authsService;
        this.userService = userService;
    }


    @PostMapping("/user-login")
    public ResponseDto userLogin(@RequestBody LoginReqDto loginReqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN, new DefaultResponse<>(authsService.userLogin(loginReqDto)));
    }

    @PostMapping("/seller-login")
    public ResponseDto sellerLogin(@RequestBody LoginReqDto loginReqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN, new DefaultResponse<>(authsService.sellerLogin(loginReqDto)));
    }

    @PostMapping("/admin-login")
    public ResponseDto adminLogin(@RequestBody LoginReqDto loginReqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN, new DefaultResponse<>(authsService.adminLogin(loginReqDto)));
    }

    @PostMapping("/logout")
    public ResponseDto userLogout() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGOUT, new DefaultResponse<String>(authsService.doLogout()));
    }

    @PostMapping("/social")
    public ResponseDto oauthLogin(@RequestParam String provider, @RequestParam String accessToken) {
        // 1. OAuth 제공자를 통해 사용자 정보 가져오기
        String email = authsService.getOauthUser(provider, accessToken);

        // 2. 이메일로 기존 계정 확인
        User user = authsService.findByEmail(email);


        if (user != null) {
            // 3. 계정이 있으면 로그인 처리 (JWT 발급)
            String new_accessToken = jwtTokenProvider.createAccessToken(email);

            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN,new DefaultResponse<>(new_accessToken));
        } else {
            // 4. 계정이 없으면 회원가입 진행을 위해 사용자 정보를 반환
            return new ResponseDto(HttpStatus.NOT_FOUND, ResponseCode.NOT_FOUND_USER, new DefaultResponse<>(accessToken));
        }
    }

    @PostMapping("/social/login")
    public ResponseDto oauth(@RequestParam String provider, @RequestParam String accessToken){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN, new DefaultResponse<>(authsService.findOauthUser(provider, accessToken)));
    }



}
