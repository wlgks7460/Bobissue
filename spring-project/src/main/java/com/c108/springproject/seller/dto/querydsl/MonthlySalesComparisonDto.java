package com.c108.springproject.seller.dto.querydsl;

import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MonthlySalesComparisonDto {
    private Long currentMonthSales;      // 당월 판매량
    private Long previousMonthSales;     // 전월 판매량
    private Double salesGrowthRate;      // 판매량 증감률

    private Long currentMonthRevenue;    // 당월 매출
    private Long previousMonthRevenue;   // 전월 매출
    private Double revenueGrowthRate;    // 매출 증감률

    // 증감률 계산 메서드
    public void calculateGrowthRates() {
        this.salesGrowthRate = calculateGrowthRate(previousMonthSales, currentMonthSales);
        this.revenueGrowthRate = calculateGrowthRate(previousMonthRevenue, currentMonthRevenue);
    }

    private Double calculateGrowthRate(Long previous, Long current) {
        if (previous == 0) return 0.0;
        return ((current - previous) / (double) previous) * 100;
    }
}
