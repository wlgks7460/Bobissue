package com.c108.springproject.user.dto;

import com.c108.springproject.user.domain.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResDto {
    private int userNo;
    private String name;
    private String birthday;
    private String email;
    private String gender;
    private float height;
    private float weight;
    private int loginType;//
    private String phoneNumber;
    private String createAt;
    private String updateAt;
    private int gradeNo;

    public UserResDto(User user) {
        this.userNo = user.getUserNo();
        this.name = user.getName();
        this.birthday = user.getBirthday();
        this.email = user.getEmail();
        this.gender = user.getGender();
        this.height = user.getHeight();
        this.weight = user.getWeight();
        this.loginType = user.getLoginType();
        this.phoneNumber = user.getPhoneNumber();
        this.createAt = user.getCreatedAt();
        this.updateAt = user.getUpdatedAt();
        this.gradeNo = user.getGradeNo();
    }

}
