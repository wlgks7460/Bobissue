package com.c108.springproject.review.dto.response;

import com.c108.springproject.review.domain.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;


@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewDetailResDto {
    private Long reviewNo;
    private int itemNo;
    private List<ReviewImageDto> images;
    private String content;
    private int rating;
    private String createdAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;
    private long reportCount;    // 신고 횟수

    public static ReviewDetailResDto toDto(Review review) {
        return ReviewDetailResDto.builder()
                .reviewNo(review.getReviewNo())
                .itemNo(review.getItemNo())
                .images(review.getImages().stream()
                        .map(image -> ReviewImageDto.builder()
                                .imageNo(image.getImageNo())
                                .imageUrl(image.getImageUrl())
                                .originalName(image.getOriginalName())
                                .build())
                        .collect(java.util.stream.Collectors.toList()))
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
