package com.c108.springproject.item.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "itemcategory")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemCategory extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int categoryNo;

    @Column(nullable = false, length = 50)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_no")
    @JsonIgnore
    private ItemCategory parent; // 부모 카테고리

    @Builder.Default
    @OneToMany(mappedBy = "categoryNo")
    private List<Item> items = new ArrayList<>();

    @OneToMany(mappedBy = "parent")
    @Builder.Default
    private List<ItemCategory> children = new ArrayList<>();
}
