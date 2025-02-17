package com.c108.springproject.item.repository.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemBestSellerDto {
    private Integer itemNo;
    private String itemName;
    private Integer price;
    private Long totalSales;             // 전체 판매량
    private Long maleSales;              // 남성 구매 수
    private Long femaleSales;            // 여성 구매 수
    private Double malePercentage;       // 남성 구매 비율
    private Double femalePercentage;     // 여성 구매 비율
}
