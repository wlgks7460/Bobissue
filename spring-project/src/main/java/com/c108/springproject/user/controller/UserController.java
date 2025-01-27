package com.c108.springproject.user.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.user.dto.SignUpReqDto;
import com.c108.springproject.user.dto.UserDto;
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

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/sign-up")
    public ResponseDto signUp(@RequestBody SignUpReqDto signUpDto) {
        userService.signUp(signUpDto);

        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_USER, null);
    }

    @GetMapping
    public ResponseDto findUserList() {
        List<UserResDto> userList = userService.findUserList();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FOUND_USER_LIST, new DefaultResponse<List<UserResDto>>(userList));
    }

    @GetMapping("/{userNo}")
    public ResponseDto findUserById(@PathVariable int userNo) {
        UserResDto userResDto = userService.findUserById(userNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_USER, new DefaultResponse<UserResDto>(userResDto));
    }

    @PutMapping("/{userNo}")
    public ResponseDto updateUser(@PathVariable int userNo, @RequestBody UserDto userDto) {
        userService.updateUser(userNo, userDto);
        return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_FIND_USER, null);
    }

    @DeleteMapping("/{userNo}")
    public ResponseDto deleteUser(@PathVariable int userNo) {
        userService.deleteUser(userNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_USER, null);
    }
}
