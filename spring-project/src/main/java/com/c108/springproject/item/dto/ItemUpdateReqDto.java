package com.c108.springproject.item.dto;


import java.math.BigInteger;
import lombok.*;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemUpdateReqDto {
    private int categoryNo;
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
