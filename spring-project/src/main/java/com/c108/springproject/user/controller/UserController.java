package com.c108.springproject.user.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.user.dto.SignUpDto;
import com.c108.springproject.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("/")
    public ResponseDto signUp(@RequestBody SignUpDto signUpDto) {
        userService.signUp(signUpDto);

        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_USER,new DefaultResponse<String>(signUpDto.getName()));
    }



}
