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
    private BigInteger imageNo;
    private int categoryNo;
    private String categoryName;
    private String name;
    private int time;
    private String content;  // 상세 설명
    private List<MaterialResDto> materials;
    private String createdAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;

    public static RecipeResDto toDto(Recipe recipe) {
        return RecipeResDto.builder()
                .recipeNo(recipe.getRecipeNo())
                .imageNo(recipe.getImageNo())
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
