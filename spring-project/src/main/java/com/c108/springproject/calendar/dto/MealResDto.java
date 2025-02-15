package com.c108.springproject.calendar.dto;

import com.c108.springproject.calendar.domain.Calendar;
import com.c108.springproject.calendar.domain.MealImage;
import com.c108.springproject.item.dto.response.ImageDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MealResDto {
    private long calendarNo;
    private String name;
    private String eatTime;
    private int calorie;
    private List<MealImageReqDto> images;

    public static MealResDto toDto(Calendar calendar) {
        return MealResDto.builder()
                .calendarNo(calendar.getCalendarNo())
                .name(calendar.getName())
                .calorie(calendar.getCalorie())
                .eatTime(calendar.getEatDate())
                .images(calendar.getImages().stream()
                        .map(MealImageReqDto::toDto)
                        .collect(Collectors.toList()))
                .build();
    }
}
