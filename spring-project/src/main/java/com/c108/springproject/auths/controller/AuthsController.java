package com.c108.springproject.auths.controller;

import com.c108.springproject.auths.dto.request.LoginReqDto;
import com.c108.springproject.auths.service.AuthsService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auths")
public class AuthsController {

    private final AuthsService authsService;

    public AuthsController(AuthsService authsService){
        this.authsService = authsService;
    }


    @PostMapping("/user-login")
    public ResponseDto userLogin(@RequestBody LoginReqDto loginReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN, new DefaultResponse<>(authsService.userLogin(loginReqDto)));
    }

    @PostMapping("/seller-login")
    public ResponseDto sellerLogin(@RequestBody LoginReqDto loginReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN, new DefaultResponse<>(authsService.sellerLogin(loginReqDto)));
    }

    @PostMapping("/admin-login")
    public ResponseDto adminLogin(@RequestBody LoginReqDto loginReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGIN, new DefaultResponse<>(authsService.adminLogin(loginReqDto)));
    }

    @PostMapping("/logout")
    public ResponseDto userLogout(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_LOGOUT, new DefaultResponse<String>(authsService.doLogout()));
    }
}
