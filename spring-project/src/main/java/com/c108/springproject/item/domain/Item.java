package com.c108.springproject.item.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne(fetch = FetchType.LAZY )
    @JoinColumn(name = "category_no", nullable = false)
    @JsonIgnore // 순환참조 해결
    private ItemCategory categoryNo;

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

    @Column(nullable = false, length = 15)
    private String createdAt;

    @Column(nullable = false, length = 15)
    private String updatedAt;

    @Column(nullable = true, length = 15)
    private String expiredAt;

    @Column(nullable = true, length = 255)
    private String description;

    @Column(nullable = false)
    private int stock;
}
