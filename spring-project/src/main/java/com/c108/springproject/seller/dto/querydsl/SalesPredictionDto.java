package com.c108.springproject.seller.dto.querydsl;

import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SalesPredictionDto {
    private Long predictedSales;         // 예측 판매량
    private Double confidenceRate;       // 신뢰도
    private Long previousWeekSales;      // 지난주 판매량
    private Long twoWeeksAgoSales;       // 2주 전 판매량
    private Long threeWeeksAgoSales;     // 3주 전 판매량
}
