package com.c108.springproject.item.domain;

import com.c108.springproject.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.lang.reflect.Type;

@Entity
@Table(name = "itemimage")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemImage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long imageNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_no")
    private Item item;

    @Column(nullable = false, length = 255)
    private String originalName;

    @Column(nullable = false, length = 255)
    private String imageUrl;
}
