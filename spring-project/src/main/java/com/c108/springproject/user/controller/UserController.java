package com.c108.springproject.user.controller;

import com.c108.springproject.user.dto.SignUpDto;
import com.c108.springproject.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/")
    public void signUp() {//@RequestBody @Valid SignUpDto signUpDto
        System.out.println("hi");
        SignUpDto signUpDto = new SignUpDto();
        signUpDto.setName("김경은");
        signUpDto.setBirthday("2001-05-22");
        signUpDto.setEmail("ruddms1522@naver.com");
        signUpDto.setPassword("1234");
        signUpDto.setGender('F');
        signUpDto.setLoginType(0);
        signUpDto.setPhoneNumber("010-5636-3512");
        userService.signUp(signUpDto);

//        return ResponseEntity.ok("success");
    }
}
