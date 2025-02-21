package com.c108.springproject.admin.dto.querydsl;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyMonthlySalesDto {
    private Integer companyNo;     // 회사 번호
    private String companyName;    // 회사명
    private String yearMonth;      // 년월 (YYYYMM)
    private Long monthlySales;     // 월별 매출액
}
