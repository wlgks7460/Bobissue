package com.c108.springproject.recipe.dto.response;
import com.c108.springproject.recipe.domain.Recipe;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeCreateResDto {
    private int recipeNo;
    private List<RecipeImageDto> images;
    private int categoryNo;
    private String categoryName;
    private String name;
    private String description;
    private int time;
    private List<MaterialResDto> materials;
    private String createdAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;

    public static RecipeCreateResDto toDto(Recipe recipe) {
        return RecipeCreateResDto.builder()
                .recipeNo(recipe.getRecipeNo())
                .images(recipe.getImages().stream()
                        .map(image -> RecipeImageDto.toDto(image))
                        .collect(Collectors.toList())
                )
                .categoryNo(recipe.getCategory().getCategoryNo())
                .categoryName(recipe.getCategory().getName())
                .name(recipe.getName())
                .time(recipe.getTime())
                .description(recipe.getDescription())
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
