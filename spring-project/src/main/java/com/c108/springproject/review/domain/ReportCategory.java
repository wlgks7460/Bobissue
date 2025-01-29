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
    -- 신고 카테고리 테이블의 기본 데이터 삽입
INSERT INTO report_category (category_no, name, created_at, created_user, updated_at, updated_user)
VALUES
    (1, '허위/과장 리뷰', DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1, DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1),
    (2, '광고성 리뷰', DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1, DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1),
    (3, '욕설/비방', DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1, DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1),
    (4, '개인정보 노출', DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1, DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1),
    (5, '음란성 리뷰', DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1, DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1),
    (6, '저작권 침해', DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1, DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1),
    (7, '기타', DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1, DATE_FORMAT(NOW(), '%Y%m%d %H%i%s'), 1);
     */
}
