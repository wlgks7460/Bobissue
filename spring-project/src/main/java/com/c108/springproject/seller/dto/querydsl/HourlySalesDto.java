package com.c108.springproject.seller.dto.querydsl;

import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class HourlySalesDto {
    private Integer hour;                // 시간대 (0-23)
    private Long salesCount;             // 판매 건수
    private Long totalRevenue;           // 매출액
    private Double averageOrderAmount;   // 평균 주문금액

    public void calculateAverageOrderAmount() {
        if (salesCount == 0) {
            this.averageOrderAmount = 0.0;
        } else {
            this.averageOrderAmount = totalRevenue.doubleValue() / salesCount;
        }
    }
}
