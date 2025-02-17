package com.c108.springproject.seller.dto.querydsl;

import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class CategorySalesDto {
    private Integer categoryNo;
    private String categoryName;
    private Long totalSales;             // 총 판매량
    private Long totalRevenue;           // 총 매출액
    private Integer itemCount;           // 카테고리 내 상품 수
    private Double averagePrice;         // 평균 가격
}
