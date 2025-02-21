package com.c108.springproject.recipe.dto.response;

import com.c108.springproject.recipe.domain.RecipeCategory;
import lombok.*;

@Getter
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeCategoryResDto {
    private int categoryNo;
    private String name;
    private String createAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;
    private String delYn;

    public static RecipeCategoryResDto toDto(RecipeCategory recipeCategory) {
    RecipeCategoryResDto recipeCategoryResDto = RecipeCategoryResDto.builder()
            .categoryNo(recipeCategory.getCategoryNo())
            .name(recipeCategory.getName())
            .createAt(recipeCategory.getCreatedAt())
            .createdUser(recipeCategory.getCreatedUser())
            .updatedAt(recipeCategory.getUpdatedAt())
            .updatedUser(recipeCategory.getUpdatedUser())
            .delYn(recipeCategory.getDelYn())
            .build();
    return recipeCategoryResDto;
    }
}