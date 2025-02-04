package com.c108.springproject.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class KakaoReqDto {
    private String email;
    private String loginType = "Kakao";

}
