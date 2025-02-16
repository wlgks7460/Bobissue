package com.c108.springproject.global.querydsl.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryPreferenceDto {
    private Integer categoryNo;
    private String categoryName;
    private Long orderCount;
    private Long totalRevenue;
}
