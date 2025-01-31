package com.c108.springproject.review.dto.response;

import com.c108.springproject.review.domain.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDetailResDto {
    private Long reviewNo;
    private int itemNo;
    private Long imageNo;
    private String content;
    private int rating;
    private String createdAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;
    private long reportCount;    // 신고 횟수

    public static ReviewDetailResDto toDto(Review review) {
        return ReviewDetailResDto.builder()
                .reviewNo(review.getReviewNo())
                .itemNo(review.getItemNo())
                .imageNo(review.getImageNo())
                .content(review.getContent())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .createdUser(review.getCreatedUser())
                .updatedAt(review.getUpdatedAt())
                .updatedUser(review.getUpdatedUser())
                .reportCount(review.getReports().size())
                .build();
    }
}
