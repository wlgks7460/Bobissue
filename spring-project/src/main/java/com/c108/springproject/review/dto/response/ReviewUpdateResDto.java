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
public class ReviewUpdateResDto {
    private Long reviewNo;
    private int itemNo;
    private Long imageNo;
    private String content;
    private int rating;
    private String createdAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;
    private String delYn;

    public static ReviewUpdateResDto toDto(Review review) {
        return ReviewUpdateResDto.builder()
                .reviewNo(review.getReviewNo())
                .itemNo(review.getItemNo())
                .imageNo(review.getImageNo())
                .content(review.getContent())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .createdUser(review.getCreatedUser())
                .updatedAt(review.getUpdatedAt())
                .updatedUser(review.getUpdatedUser())
                .delYn(review.getDelYn())
                .build();
    }
}
