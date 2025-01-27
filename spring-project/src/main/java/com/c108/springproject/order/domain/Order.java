package com.c108.springproject.order.domain;

import com.c108.springproject.global.entity.BaseEntity;
import jakarta.persistence.*;

import java.math.BigInteger;

public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int orderNo;

    @Column(nullable = false)
    private int userNo;
    @Column(nullable = false)
    private int addressNo;
    @Column(nullable = false)
    private BigInteger userCouponNo;
    @Column(nullable = false)
    private int orderCategoryNo;
    @Column(nullable = false)
    private int delCategoryNo;
    @Column(nullable = false, length = 255)
    private String  payment;
    @Column(nullable = false)
    private int totalPrice;

    @Column(nullable = false, length = 255)
    private String requests;




}
