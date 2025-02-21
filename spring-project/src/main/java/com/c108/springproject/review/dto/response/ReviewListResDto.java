package com.c108.springproject.review.dto.response;

import com.c108.springproject.review.domain.Review;
import com.c108.springproject.user.domain.User;
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
public class ReviewListResDto {
    private Long reviewNo;
    private List<ReviewImageDto> images;
    private String content;
    private int rating;
    private String createdAt;
    private String createdUser;
    private String updatedAt;
    private String userName;

    public static ReviewListResDto toDto(Review review, User user) {
        return ReviewListResDto.builder()
                .reviewNo(review.getReviewNo())
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
                .userName(user.getName())
                .build();
    }
}
