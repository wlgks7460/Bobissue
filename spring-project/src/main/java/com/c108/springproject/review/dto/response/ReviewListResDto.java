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
public class ReviewListResDto {
    private Long reviewNo;
    private Long imageNo;
    private String content;
    private int rating;
    private String createdAt;
    private int createdUser;
    private String updatedAt;

    public static ReviewListResDto toDto(Review review) {
        return ReviewListResDto.builder()
                .reviewNo(review.getReviewNo())
                .imageNo(review.getImageNo())
                .content(review.getContent())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .createdUser(review.getCreatedUser())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
}
