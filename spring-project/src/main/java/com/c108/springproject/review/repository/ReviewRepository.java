package com.c108.springproject.review.repository;

import com.c108.springproject.review.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    // 특정 상품의 삭제되지 않은 리뷰 목록 조회
    List<Review> findByItemItemNoAndDelYn(int itemNo, String delYn);

    // 특정 상품의 평균 평점 계산 (삭제되지 않은 리뷰만)
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.item.itemNo = :itemNo AND r.delYn = 'N'")
    Double calculateAverageRatingByItemNo(@Param("itemNo") int itemNo);

    // 특정 상품의 평점별 리뷰 수 계산
    @Query("SELECT r.rating, COUNT(r) FROM Review r WHERE r.item.itemNo = :itemNo AND r.delYn = 'N' GROUP BY r.rating")
    List<Object[]> countReviewsByRating(@Param("itemNo") int itemNo);

    List<Review> findByItemNo(int itemNo);
}
