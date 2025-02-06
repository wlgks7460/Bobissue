package com.c108.springproject.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NaverReqDto {
    private String name;
    private String birthday;
    private String email;
    private String password;
    private String gender;
    private String phoneNumber;
    private String loginType = "Naver";

}
