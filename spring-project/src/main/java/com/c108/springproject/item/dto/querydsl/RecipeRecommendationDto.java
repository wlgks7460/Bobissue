package com.c108.springproject.item.dto.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecipeRecommendationDto {
    private Integer recipeNo;
    private String recipeName;
    private String recipeDescription;
    private Integer cookingTime;
    private List<MaterialDto> materials;  // 레시피에 필요한 재료 목록
}
