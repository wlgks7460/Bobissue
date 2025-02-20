package com.c108.springproject.item.dto.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemRecommendationDto {
    private Integer itemNo;
    private String itemName;
    private Integer price;
    private Long totalSales;
    private Double averageRating;
}
