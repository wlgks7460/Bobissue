package com.c108.springproject.admin.dto.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyStatisticsDto {
    private Long totalCompanies;           // 전체 회사 수
    private Long activeCompanies;          // 활성 회사 수
    private List<CompanySalesDto> companySalesStats;  // 회사별 매출 통계
    private List<CompanyMonthlySalesDto> companyMonthlySales;  // 회사별 월간 매출

}
