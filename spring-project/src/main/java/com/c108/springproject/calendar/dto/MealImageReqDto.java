package com.c108.springproject.calendar.dto;

import com.c108.springproject.calendar.domain.MealImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class MealImageReqDto {
    private Long imageNo;
    private String imageUrl;
    private String originalName;

    public static MealImageReqDto toDto(MealImage image) {
        return MealImageReqDto.builder()
                .imageNo(image.getImageNo())
                .imageUrl(image.getImageUrl())
                .originalName(image.getOriginalName())
                .build();
    }
}
