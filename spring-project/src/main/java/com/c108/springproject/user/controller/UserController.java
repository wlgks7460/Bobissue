package com.c108.springproject.user.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UsersResDto;
import com.c108.springproject.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService){
        this.userService=userService;
    }

    @PostMapping("/sign-up")
    public ResponseDto signUp(@RequestBody SignUpReqDto signUpDto) {
        userService.signUp(signUpDto);

        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_USER,null);
    }

    @GetMapping
    public ResponseDto findUserList() {
        List<UsersResDto> userList = userService.findUserList();

        return new ResponseDto(HttpStatus.FOUND, ResponseCode.SUCCESS_FOUND_USER_LIST,new DefaultResponse<List<UsersResDto>>(userList));
    }




}
