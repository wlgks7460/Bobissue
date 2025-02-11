package com.c108.springproject.cast.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.item.domain.Item;
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
public class CastItem extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long castItemNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cast_no", nullable = false)
    private Cast cast;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_no", nullable = false)
    private Item item;


}
