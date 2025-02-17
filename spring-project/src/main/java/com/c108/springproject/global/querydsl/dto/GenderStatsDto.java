package com.c108.springproject.global.querydsl.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GenderStatsDto {
    private String gender;            // 성별
    private Long totalOrders;         // 주문 수
    private Long totalRevenue;        // 총 매출
    private Double averageOrderAmount;// 평균 주문금액
    private List<CategoryPreferenceDto> topCategories; // 선호 카테고리
}
