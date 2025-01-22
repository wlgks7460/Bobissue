package com.c108.springproject.items.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor; // 데이터베이스 테이블에 매핑
import lombok.Builder;
import lombok.Getter; // 모든 필드에 getter 메서드 생성
import lombok.NoArgsConstructor; // 기본 생성자 생성

import java.math.BigInteger;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    // 기본 키
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int itemNo;

    //나중에 연결
    @Column(nullable = false)
    private int categoryNo;
    // 나중에 연결
    @Column(nullable = false)
    private BigInteger imageNo;
    // 나중에 연결
    @Column(nullable = false)
    private int companyNo;

    @Column(nullable = false)
    private int price;

    @Column(nullable = true)
    private int salePrice;

    @Column(nullable = false)
    private String createdAt;

    @Column(nullable = false)
    private String updatedAt;

    @Column(nullable = true)
    private String expiredAt;

    @Column(nullable = true)
    private String description;

    @Column(nullable = false)
    private int stock;
}
