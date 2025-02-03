package com.c108.springproject.item.dto.request;

import lombok.*;
import lombok.AllArgsConstructor;

import java.math.BigInteger;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemCreateReqDto {
    private int categoryNo;
    private Long imageNo;
    private int companyNo;
    private String name;
    private int price;
    private int salePrice;
//    private String createdAt;
//    private int createdUser;
//    private String updatedAt;
//    private int updatedUser;
    private String expiredAt;
    private String description;
    private int stock;
//    private String delYn;
}
