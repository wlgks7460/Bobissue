package com.c108.springproject.coupon.dto.response;

import com.c108.springproject.coupon.domain.Coupon;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CouponResDto {

    private int couponNo;
    private String name;
    private String content;
    private int deductedPrice;
    private int minDeliveryPrice;
    private int term;
    private String createAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;
    private String delYN;

    public static CouponResDto toDto (Coupon coupon){
        return CouponResDto.builder()
                .couponNo(coupon.getCouponNo())
                .name(coupon.getName())
                .content(coupon.getContent())
                .deductedPrice(coupon.getDeductedPrice())
                .minDeliveryPrice(coupon.getMinDeliveryPrice())
                .term(coupon.getTerm())
                .createAt(coupon.getCreatedAt())
                .createdUser(coupon.getCreatedUser())
                .updatedAt(coupon.getUpdatedAt())
                .updatedUser(coupon.getUpdatedUser())
                .delYN(coupon.getDelYn())
                .build();
    }
}
