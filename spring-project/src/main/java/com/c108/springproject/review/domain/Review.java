package com.c108.springproject.review.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemImage;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long reviewNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_no", nullable = false)
    @JsonIgnore
    private Item item;

    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default // 이거 Builder 통해서 객체를 생성할 때는 images 리스트 초기화 안된대영
    private List<ReviewImage> images = new ArrayList<>();

    @Column(nullable = false, length = 255)
    private String content;

    @Column(nullable = false)
    private int rating;

    // 신고 목록
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();

    public void update(String content, int rating) {
        this.content = content;
        this.rating = rating;
    }
}
