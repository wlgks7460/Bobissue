package com.c108.springproject.user.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.user.dto.UserDto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int userNo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String birthday;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String gender;

    @Column
    private float height;

    @Column
    private float weight;

    @Column
    private String loginType; //Kakao or Naver

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;

    @Column(nullable = false)
    private int point;

    @Column(nullable = false)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserGrade grade;

    @Column(nullable = false)
    private int amount; // 한달 사용 금액

    @Column
    @Setter
    private int baseAddress;

    public void updateUser(UserDto userDto) {
        this.name = userDto.getName();
        this.email = userDto.getEmail();
        this.height = userDto.getHeight();
        this.weight = userDto.getWeight();
        this.phoneNumber = userDto.getPhoneNumber();
    }

    public void updateGrade(int amount) {
        this.grade = UserGrade.getGradeByAmount(this.amount);
    }


}
