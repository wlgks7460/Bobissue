package com.c108.springproject.question.dto.response;


import com.c108.springproject.question.domain.QuestionImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class QuestionImageDto {
    private Long imageNo;
    private String imageUrl;
    private String originalName;

    public static QuestionImageDto toDto(QuestionImage image) {
        return QuestionImageDto.builder()
                .imageNo(image.getImageNo())
                .imageUrl(image.getImageUrl())
                .originalName(image.getOriginalName())
                .build();
    }
}
