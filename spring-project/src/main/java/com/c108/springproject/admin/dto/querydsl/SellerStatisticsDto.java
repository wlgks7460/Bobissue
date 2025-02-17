package com.c108.springproject.admin.dto.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerStatisticsDto {
    private Map<String, Long> sellerStatusStats;    // 판매자 상태별 통계
    private Map<String, Long> sellerApprovalStats;  // 판매 승인 상태별 통계
    private List<SellerSalesDto> sellerSalesStats;  // 판매자별 매출 통계
    private List<MonthlySellerJoinDto> monthlyJoinStats; // 월별 가입자 추이
}
