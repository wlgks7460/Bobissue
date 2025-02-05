package com.c108.springproject.review.dto.response;

import com.c108.springproject.review.domain.ReviewImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ReviewImageDto {
    private Long imageNo;
    private String imageUrl;
    private String originalName;
    public static ReviewImageDto toDto(ReviewImage image) {
        return ReviewImageDto.builder()
                .imageNo(image.getImageNo())
                .imageUrl(image.getImageUrl())
                .originalName(image.getOriginalName())
                .build();
    }
}
