package com.c108.springproject.admin.dto.querydsl;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MonthlySellerJoinDto {
    private String yearMonth;
    private Long totalSeller; // 전체 가입자 수
    private Long approvedSeller;
//    private Double approvalRate; // 승인 비율
}
