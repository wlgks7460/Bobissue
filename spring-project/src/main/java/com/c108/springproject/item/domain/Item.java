package com.c108.springproject.item.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item extends BaseEntity {
    // 기본 키
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int itemNo;

    @ManyToOne(fetch = FetchType.LAZY )
    @JoinColumn(name = "category_no", nullable = false)
    @JsonIgnore // 순환참조 해결
    private ItemCategory categoryNo;

    // 나중에 연결a
    @Column(nullable = false)
    private BigInteger imageNo;
    // 나중에 연결
    @Column(nullable = false)
    private int companyNo;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int price;

    @Column(nullable = true)
    private int salePrice;

//    @Column(nullable = false, length = 15)
//    private String createdAt;

    @Column(nullable = false)
    private int createdUser ;

//    @Column(nullable = false, length = 15)
//    private String updatedAt;

    @Column(nullable = false)
    private int updatedUser ;

    @Column(nullable = true, length = 15)
    private String expiredAt;

    @Column(nullable = true, length = 255)
    private String description;

    @Column(nullable = false)
    private int stock;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String delYn = "N";
}
