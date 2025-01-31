package com.c108.springproject.review.domain;


import com.c108.springproject.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private BigInteger reportNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_no")
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_no")
    private ReportCategory category;

    @Column(nullable = false)
    private String title;

    @Column(length = 255)
    private String content;

    @Column(length = 1, nullable = false, columnDefinition = "CHAR(1)")
    private String status = "N"; // (N: 미처리, Y: 처리완료)

    public void updateStatus(String status) {
        this.status = status;
    }
}

