package com.c108.springproject.global.oauth;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.user.domain.User;

import lombok.Builder;

import java.util.Map;

@Builder
public record OAuth2UserInfo(
        String name,
        String email,
        String profile
) {
    public static OAuth2UserInfo of(String registrationId, Map<String, Object> attributes){
        return switch (registrationId){
            case "kakao" -> ofKakao(attributes);
            default -> throw new BobIssueException(ResponseCode.ILLEGAL_REGISTRATION_ID);
        };
    }

    private static OAuth2UserInfo ofKakao(Map<String, Object> attributes){
        Map<String, Object> account = (Map<String, Object>) attributes.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) account.get("profile");

        System.out.println((String) profile.get("nickname"));

        return OAuth2UserInfo.builder()
                .name((String) profile.get("nickname"))
                .email((String) account.get("email"))
                .profile((String) profile.get("profile_image_url"))
                .build();
    }

    public User toEntity(){
        return User.builder()
                .name(name)
                .birthday("20110206")
                .email(email)
                .password("11111")
                .gender("M")
                .status("Y")
                .point(0)
                .phoneNumber("010-1111-1111")
                .gradeNo(0)
                .build();
    }
}
