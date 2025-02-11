package com.c108.springproject.user.dto;

import com.c108.springproject.notification.domain.Notification;
import com.c108.springproject.notification.dto.response.NotificationResDto;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.domain.UserGrade;
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
    private UserGrade grade;
    private int baseAddress;


    public UserResDto(User user) {
        this.userNo = user.getUserNo();
        this.name = user.getName();
        this.birthday = user.getBirthday();
        this.email = user.getEmail();
        this.gender = user.getGender();
        this.height = user.getHeight();
        this.weight = user.getWeight();
        this.phoneNumber = user.getPhoneNumber();
        this.createAt = user.getCreatedAt();
        this.updateAt = user.getUpdatedAt();
        this.grade = user.getGrade();
        this.baseAddress = user.getBaseAddress();
    }


    public static UserResDto toDto(User user){
        return UserResDto.builder()
                .userNo(user.getUserNo())
                .name(user.getName())
                .birthday(user.getBirthday())
                .gender(user.getGender())
                .email(user.getEmail())
                .height(user.getHeight())
                .weight(user.getWeight())
                .phoneNumber(user.getPhoneNumber())
                .createAt(user.getCreatedAt())
                .updateAt(user.getUpdatedAt())
                .grade(user.getGrade())
                .baseAddress(user.getBaseAddress())
                .build();
    }

}
