package com.c108.springproject.calendar.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealReqDto {
    private String name;
    private String eatTime;
    private int calorie;
    // 이미지 추가
}
