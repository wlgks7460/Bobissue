package com.c108.springproject.items.dto;

import jakarta.persistence.Column;
import lombok.*;
import lombok.AllArgsConstructor;

import java.math.BigInteger;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemCreateReqDto {
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
