package com.c108.springproject.item.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemListResDto {
    private int itemNo;
    private int categoryNo;
    private Long imageNo;
    private int companyNo;
    private String name;
    private int price;
    private int salePrice;
//    private String createdAt;
//    private String updatedAt;
//    private String expiredAt;
    private String description;
//    private int stock;
//    private String delYn;
}
