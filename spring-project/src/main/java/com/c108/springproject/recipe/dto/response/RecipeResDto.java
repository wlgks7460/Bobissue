package com.c108.springproject.recipe.dto.response;

import com.c108.springproject.recipe.domain.Recipe;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeResDto {
    private int recipeNo;
    private List<RecipeImageDto> images;
    private int categoryNo;
    private String categoryName;
    private String name;
    private int time;
    private String content;  // 상세 설명
    private List<MaterialResDto> materials;
    private String createdAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;

    public static RecipeResDto toDto(Recipe recipe) {
        return RecipeResDto.builder()
                .recipeNo(recipe.getRecipeNo())
                .images(recipe.getImages().stream()
                        .map(image -> RecipeImageDto.toDto(image))
                        .collect(Collectors.toList())
                )
                .categoryNo(recipe.getCategory().getCategoryNo())
                .categoryName(recipe.getCategory().getName())
                .name(recipe.getName())
                .time(recipe.getTime())
                .materials(recipe.getMaterials().stream()
                        .map(MaterialResDto::toDto)
                        .collect(Collectors.toList()))
                .createdAt(recipe.getCreatedAt())
                .createdUser(recipe.getCreatedUser())
                .updatedAt(recipe.getUpdatedAt())
                .updatedUser(recipe.getUpdatedUser())
                .build();
    }
}
