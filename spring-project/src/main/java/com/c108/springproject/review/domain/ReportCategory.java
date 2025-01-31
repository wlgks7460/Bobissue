package com.c108.springproject.review.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int categoryNo;

    @Column(nullable = false, length = 50)
    private String name;

    // 카테고리의 신고 목록
    @OneToMany(mappedBy = "category")
    private List<Report> reports = new ArrayList<>();


    /*
        INSERT INTO report_category (category_no, name) VALUES
        (1, '허위/과장 리뷰'),
        (2, '광고성 리뷰'),
        (3, '욕설/비방'),
        (4, '개인정보 노출'),
        (5, '음란성 리뷰'),
        (6, '저작권 침해'),
        (7, '기타');
     */
}
