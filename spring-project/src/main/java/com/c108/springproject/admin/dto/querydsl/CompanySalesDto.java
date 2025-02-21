package com.c108.springproject.admin.dto.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanySalesDto {
    private Integer companyNo;     // 회사 번호
    private String companyName;    // 회사명
    private Long totalSales;       // 총 매출액
}
