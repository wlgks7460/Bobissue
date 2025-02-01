package com.c108.springproject.recipe.dto.response;
import com.c108.springproject.recipe.domain.Recipe;
import com.c108.springproject.recipe.dto.request.MaterialReqDto;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeCreateResDto {
    private int recipeNo;
    private Long imageNo;
    private int categoryNo;
    private String categoryName;
    private String name;
    private int time;
    private List<MaterialResDto> materials;
    private String createdAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;

    public static RecipeCreateResDto toDto(Recipe recipe) {
        return RecipeCreateResDto.builder()
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
