package com.c108.springproject.order.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCreateReqDto {
    private int userNo;
    private int addressNo;
    private BigInteger userCouponNo;
    private String payment;
    private String requests;
    private List<OrderItemReqDto> items;
}
