package com.c108.springproject.calendar.dto;

import com.c108.springproject.calendar.domain.Calendar;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealResDto {

    private String name;
    private String eatTime;
    private int calorie;
    //이미지

    public static MealResDto toDto(Calendar calendar) {
        MealResDto mealResDto = MealResDto.builder()
                .name(calendar.getName())
                .calorie(calendar.getCalorie())
                .eatTime(calendar.getEatDate())
                .build();

        return mealResDto;
    }
}
