package com.c108.springproject.item.dto.response;

import lombok.*;
import lombok.AllArgsConstructor;
import com.c108.springproject.item.dto.response.ItemCategoryResDto;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemCreateResDto {
    private int itemNo;
    private ItemCategoryResDto category;
    private Long imageNo;
    private int companyNo;
    private String name;
    private int price;
    private int salePrice;
    private String createdAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;
    private String expiredAt;
    private String description;
    private int stock;
    private String delYn;
}
