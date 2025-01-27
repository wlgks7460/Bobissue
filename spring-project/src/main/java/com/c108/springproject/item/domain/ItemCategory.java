package com.c108.springproject.item.domain;

import com.c108.springproject.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

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

    @OneToMany(mappedBy = "categoryNo")
    private List<Item> items;
}
