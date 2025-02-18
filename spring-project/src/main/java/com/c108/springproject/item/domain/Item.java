package com.c108.springproject.item.domain;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.seller.domain.Company;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

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
    private ItemCategory category;

    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemImage> images = new ArrayList<>();
    // CascadeType.ALL은 Item 엔티티에 대해 수행하는 모든 작업이 ItemImage 엔티티에도 동일하게 적용

    @ManyToOne
    @JoinColumn(name = "company_no", nullable = false)
    private Company company;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int price;

    @Column(nullable = true)
    private int salePrice;

    @Column(nullable = true, length = 15)
    private String expiredAt;

    @Column(nullable = true, length = 255)
    private String description;

    @Setter
    @Column(nullable = false)
    private int stock;

}
