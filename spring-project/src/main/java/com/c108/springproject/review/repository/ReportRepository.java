package com.c108.springproject.review.repository;

import com.c108.springproject.review.domain.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Integer> {
    List<Report> findByReviewReviewNo(int reviewNo);

    // 특정 카테고리의 미처리 신고 목록 조회
    List<Report> findByCategoryCategoryNoAndStatus(int categoryNo, String status);
}
