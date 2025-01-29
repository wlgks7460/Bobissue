package com.c108.springproject.coupon.domain;

import com.c108.springproject.coupon.dto.request.CouponReqDto;
import com.c108.springproject.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Coupon extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int couponNo;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String content;

    @Column(nullable = false)
    private int deductedPrice;

    @Column(nullable = false)
    private int minDeliveryPrice;

    @Column(nullable = false)
    private int term;

    public void updateCoupon(CouponReqDto couponReqDto){
        this.name = couponReqDto.getName();
        this.content = couponReqDto.getContent();
        this.deductedPrice = couponReqDto.getDeductedPrice();
        this.minDeliveryPrice = couponReqDto.getMinDeliveryPrice();
        this.term = couponReqDto.getTerm();
    }
}
