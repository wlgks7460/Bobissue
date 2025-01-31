package com.c108.springproject.review.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.review.domain.Report;
import com.c108.springproject.review.domain.ReportCategory;
import com.c108.springproject.review.domain.Review;
import com.c108.springproject.review.dto.request.*;
import com.c108.springproject.review.dto.response.*;
import com.c108.springproject.review.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReportRepository reportRepository;
    private final ReportCategoryRepository reportCategoryRepository;
    private final ItemRepository itemRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ReportRepository reportRepository,
                         ReportCategoryRepository reportCategoryRepository,
                         ItemRepository itemRepository) {
        this.reviewRepository = reviewRepository;
        this.reportRepository = reportRepository;
        this.reportCategoryRepository = reportCategoryRepository;
        this.itemRepository = itemRepository;
    }


    // 리뷰 생성
    @Transactional
    public ReviewCreateResDto createReview(ReviewCreateReqDto request) {
        // 상품 확인
        itemRepository.findById(request.getItemNo())
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        // 리뷰 평점 유효성 검사 (1-5점)
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BobIssueException(ResponseCode.INVALID_RATING);
        }

        Review review = Review.builder()
                .itemNo(request.getItemNo())
                .imageNo(request.getImageNo())
                .content(request.getContent())
                .rating(request.getRating())
                .build();

        review.setCreatedUser(request.getCreatedUser());
        review.setUpdatedUser(request.getCreatedUser());

        Review savedReview = reviewRepository.save(review);
        return ReviewCreateResDto.toDto(savedReview);
    }

    // 특정 상품의 리뷰 목록 조회

    @Transactional
    public List<ReviewListResDto> getReviewsByItem(int itemNo) {
        // 상품 확인
        itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        return reviewRepository.findByItemNoAndDelYn(itemNo, "N").stream()
                .map(ReviewListResDto::toDto)
                .collect(Collectors.toList());
    }

    // 평균 평점 조회
    @Transactional
    public double getItemAverageRating(int itemNo) {
        // 상품 확인
        itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        Double avgRating = reviewRepository.calculateAverageRatingByItemNo(itemNo);
        return avgRating != null ? avgRating : 0.0;
    }


    // 리뷰 상세 조회
    @Transactional
    public ReviewDetailResDto getReview(Long reviewNo) {
        Review review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.REVIEW_NOT_FOUND));

        return ReviewDetailResDto.toDto(review);
    }

    // 리뷰 수정
    @Transactional
    public ReviewUpdateResDto updateReview(Long reviewNo, ReviewUpdateReqDto request) {
        Review review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.REVIEW_NOT_FOUND));

        // 리뷰 평점 유효성 검사 (1-5점)
        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new BobIssueException(ResponseCode.INVALID_RATING);
        }

        // 리뷰 내용 수정
        review.update(request.getContent(), request.getRating(), request.getImageNo());
        review.setUpdatedUser(request.getUpdatedUser());

        Review updatedReview = reviewRepository.save(review);
        return ReviewUpdateResDto.toDto(updatedReview);
    }

    // 리뷰 삭제

    @Transactional
    public void deleteReview(Long reviewNo) {
        Review review = reviewRepository.findById(reviewNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.REVIEW_NOT_FOUND));
        review.delete();
        reviewRepository.save(review);
    }

}