package com.c108.springproject.auths.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginReqDto {

    private String email;
    private String password;
    private boolean isOAuth;

    //kakao 로그인용
    public static LoginReqDto kakaoLogin(String email){
        return LoginReqDto.builder()
                .email(email)
                .password("kakao")
                .isOAuth(true)
                .build();
    }

}
