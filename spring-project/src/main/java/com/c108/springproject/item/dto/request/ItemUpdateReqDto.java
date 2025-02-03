package com.c108.springproject.item.dto.request;


import java.math.BigInteger;
import lombok.*;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemUpdateReqDto {
    private int categoryNo;
    private int companyNo;
    private String name;
    private int price;
    private int salePrice;
    private String expiredAt;
    private String description;
    private int stock;
}
