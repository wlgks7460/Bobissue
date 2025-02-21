package com.c108.springproject.user.controller;

import com.c108.springproject.auths.service.AuthsService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.auths.dto.request.LoginReqDto;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UserUpdateReqDto;
import com.c108.springproject.user.dto.UserResDto;
import com.c108.springproject.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final AuthsService authsService;

    @Autowired
    public UserController(UserService userService,
                          AuthsService authsService) {
        this.userService = userService;
        this.authsService = authsService;
    }

    @PostMapping("/sign-up")
    public ResponseDto signUp(@RequestBody SignUpReqDto signUpDto) {
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_USER, new DefaultResponse<Integer>(userService.signUp(signUpDto)));
    }

    @PostMapping("/kakao/sign-up")
    public ResponseDto kakaoSignUp(@RequestBody SignUpReqDto signUpDto) {
        userService.signUp(signUpDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_USER, new DefaultResponse<>(authsService.userLogin(LoginReqDto.kakaoLogin(signUpDto.getEmail()))));
    }

    @GetMapping
    public ResponseDto findUserList() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FOUND_USER_LIST, new DefaultResponse<List<UserResDto>>(userService.findUserList()));
    }

    @GetMapping("/profile")
    public ResponseDto userProfile(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_USER, new DefaultResponse<UserResDto>(userService.userProfile()));
    }

    @GetMapping("/{userNo}")
    public ResponseDto findUserById(@PathVariable int userNo) {
        UserResDto userResDto = userService.findUserById(userNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_USER, new DefaultResponse<UserResDto>(userResDto));
    }

    @PutMapping("/{userNo}")
    public ResponseDto updateUser(@PathVariable int userNo, @RequestBody UserUpdateReqDto userUpdateReqDto) {
        return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_FIND_USER, new DefaultResponse<UserResDto>(userService.updateUser(userNo, userUpdateReqDto)));
    }

    @DeleteMapping("/{userNo}")
    public ResponseDto deleteUser(@PathVariable int userNo) {
        userService.deleteUser(userNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_USER, new DefaultResponse<Integer>(userNo));
    }

    @GetMapping("/{userNo}/orders")
    public ResponseDto getUserOrderList(@PathVariable int userNo) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_USER_ORDER_LIST,
                new DefaultResponse<>(userService.getUserOrderList(userNo))
        );
    }

    @GetMapping("/{userNo}/orders/{orderNo}")
    public ResponseDto getUserOrderDetail(
            @PathVariable int userNo,
            @PathVariable Long orderNo) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_USER_ORDER,
                new DefaultResponse<>(userService.getUserOrderDetail(orderNo))
        );
    }

    @GetMapping("/{userNo}/questions")
    public ResponseDto getUserQuestions(@PathVariable int userNo) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_ALL_QUESTION,
                new DefaultResponse<>(userService.getUserQuestions(userNo))
        );
    }

    @GetMapping("/{userNo}/questions/{questionNo}")
    public ResponseDto getUserQuestionDetail(
            @PathVariable int userNo,
            @PathVariable Long questionNo) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_QUESTION,
                new DefaultResponse<>(userService.getUserQuestionDetail(userNo, questionNo))
        );
    }

}
