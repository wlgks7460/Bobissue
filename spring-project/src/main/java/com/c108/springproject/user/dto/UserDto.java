package com.c108.springproject.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    private String name;
    private String email;
    private float height;
    private float weight;
    private String phoneNumber;

}
