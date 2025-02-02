package com.c108.springproject.review.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.review.dto.request.ReviewCreateReqDto;
import com.c108.springproject.review.dto.request.ReviewUpdateReqDto;
import com.c108.springproject.review.dto.response.*;
import com.c108.springproject.review.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item/{itemNo}/review")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // 리뷰 생성
    @PostMapping("")
    public ResponseDto createReview(
            @PathVariable int itemNo,
            @RequestBody ReviewCreateReqDto request) {
        ReviewCreateResDto response = reviewService.createReview(request);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_REVIEW, new DefaultResponse<>(response));
    }

    // 아이템의 전체 리뷰 조회
    @GetMapping("")
    public ResponseDto getReviewsByItem(@PathVariable int itemNo) {
        List<ReviewListResDto> response = reviewService.getReviewsByItem(itemNo);



        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_REVIEW, new DefaultResponse<>(response));
    }

    // 아이템의 평균 평점 조회
    @GetMapping("/rating")
    public ResponseDto getItemAverageRating(@PathVariable int itemNo) {
        double averageRating = reviewService.getItemAverageRating(itemNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_RATING, new DefaultResponse<>(averageRating));
    }

    // 특정 리뷰 조회
    @GetMapping("/{reviewNo}")
    public ResponseDto getReview(
            @PathVariable int itemNo,
            @PathVariable Long reviewNo) {
        ReviewDetailResDto response = reviewService.getReview(reviewNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_REVIEW, new DefaultResponse<>(response));
    }

    // 리뷰 수정
    @PutMapping("/{reviewNo}")
    public ResponseDto updateReview(
            @PathVariable int itemNo,
            @PathVariable Long reviewNo,
            @RequestBody ReviewUpdateReqDto request) {
        ReviewUpdateResDto response = reviewService.updateReview(reviewNo, request);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_REVIEW, new DefaultResponse<>(response));
    }

    // 리뷰 삭제
    @DeleteMapping("/{reviewNo}")
    public ResponseDto deleteReview(
            @PathVariable int itemNo,
            @PathVariable Long reviewNo) {
        reviewService.deleteReview(reviewNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_REVIEW, new DefaultResponse<>(null));
    }
}