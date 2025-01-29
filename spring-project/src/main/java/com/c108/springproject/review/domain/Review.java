package com.c108.springproject.review.domain;

import com.c108.springproject.global.entity.BaseEntity;
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
    private int reviewNo;

    @Column(nullable = false)
    private int itemNo;

    @Column(nullable = true)
    private BigInteger imageNo;

    @Column(nullable = false, length = 255)
    private String content;

    @Column(nullable = false)
    private int rating;

    // 신고 목록
    @OneToMany(mappedBy = "review", cascade = CascadeType.ALL)
    private List<Report> reports = new ArrayList<>();

    public void update(String content, int rating, BigInteger imageNo) {
        this.content = content;
        this.rating = rating;
        this.imageNo = imageNo;
    }
}
