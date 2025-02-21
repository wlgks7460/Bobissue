package com.c108.springproject.item.dto.request;


import java.math.BigInteger;
import java.util.List;

import lombok.*;
import lombok.AllArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemUpdateReqDto {
    private int categoryNo;
//    private int companyNo;
    private String name;
    private int price;
    private int salePrice;
    private String expiredAt;
    private String description;
    private int stock;
    private List<Long> KeepImageIds; // 유지할 이미지를 받을 곳
}
