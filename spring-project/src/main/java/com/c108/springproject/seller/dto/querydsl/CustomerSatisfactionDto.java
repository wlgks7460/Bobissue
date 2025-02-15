package com.c108.springproject.seller.dto.querydsl;

import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerSatisfactionDto {
    private Double repurchaseRate;    // 재구매율
    private Double averageRating;     // 평균 평점
    private Long cancelCount;         // 주문취소 수
    private Long refundCount;         // 환불 수
    private Long totalOrders;         // 전체 주문 수 (비율 계산용)

    public CustomerSatisfactionDto(Long reOrderCount, Long totalUserCount, Double averageRating,
                                   Long cancelCount, Long refundCount, Long totalOrders) {
        this.repurchaseRate = calculateRate(reOrderCount, totalUserCount);
        this.averageRating = averageRating;
        this.cancelCount = cancelCount;
        this.refundCount = refundCount;
        this.totalOrders = totalOrders;
    }

    private Double calculateRate(Long count, Long total) {
        if (total == 0) return 0.0;
        return (count.doubleValue() / total.doubleValue()) * 100;
    }
}
