package com.c108.springproject.item.repository.querydsl;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ItemRepurchaseDto {
    private Integer itemNo;
    private String itemName;
    private Integer price;
    private Long uniqueUserCount;
    private Long totalOrders;
    private Double repurchaseRate;
}
