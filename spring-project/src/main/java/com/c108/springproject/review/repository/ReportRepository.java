package com.c108.springproject.review.repository;

import com.c108.springproject.review.domain.Report;
import com.c108.springproject.review.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    // 일단 나중에 쓸만한 것들 만들어 달라고 했습니다

    // 특정 상태의 신고 목록 조회
    List<Report> findByStatus(String status);

    // 특정 리뷰에 대한 신고 목록 조회
    List<Report> findByReview(Review review);

    // 특정 사용자가 특정 리뷰에 대해 신고한 적이 있는지 확인
    boolean existsByReviewAndCreatedUser(Review review, String createdUser);

    // 특정 리뷰의 신고 수 카운트
    long countByReview(Review review);

    // 삭제되지 않은 신고 목록 조회
    List<Report> findByDelYn(String delYn);

    // 특정 상태이면서 삭제되지 않은 신고 목록 조회
    List<Report> findByStatusAndDelYn(String status, String delYn);
}
