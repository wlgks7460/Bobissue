package com.c108.springproject.coupon.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CouponReqDto {

    private String name;
    private String content;
    private int deductedPrice;
    private int minDeliveryPrice;
    private int term;
}
