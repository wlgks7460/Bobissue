package com.c108.springproject.item.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.c108.springproject.item.dto.ItemCategoryResDto;

import java.math.BigInteger;
@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemResDto {
    private int itemNo;
    private ItemCategoryResDto category;
    private BigInteger imageNo;
    private int companyNo;
    private int price;
    private int salePrice;
    private String createdAt;
    private String updatedAt;
    private String expiredAt;
    private String description;
    private int stock;
}
