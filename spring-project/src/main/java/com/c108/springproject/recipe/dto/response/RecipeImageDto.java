package com.c108.springproject.recipe.dto.response;

import com.c108.springproject.item.dto.response.ImageDto;
import com.c108.springproject.recipe.domain.RecipeImage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class RecipeImageDto {
    private Long imageNo;
    private String imageUrl;
    private String originalName;

    public static RecipeImageDto toDto(RecipeImage image) {
        return RecipeImageDto.builder()
                .imageNo(image.getImageNo())
                .imageUrl(image.getImageUrl())
                .originalName(image.getOriginalName())
                .build();
    }
}
