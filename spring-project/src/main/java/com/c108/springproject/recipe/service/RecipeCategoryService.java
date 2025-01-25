package com.c108.springproject.recipe.service;


import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.recipe.domain.RecipeCategory;
import com.c108.springproject.recipe.dto.request.RecipeCategoryReqDto;
import com.c108.springproject.recipe.dto.response.RecipeCategoryResDto;
import com.c108.springproject.recipe.repository.RecipeCategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeCategoryService {

    private final RecipeCategoryRepository recipeCategoryRepository;

    public RecipeCategoryService(RecipeCategoryRepository recipeCategoryRepository) {
        this.recipeCategoryRepository = recipeCategoryRepository;
    }

    @Transactional
    public RecipeCategory createCategory(RecipeCategoryReqDto request) {
        try {
            RecipeCategory category = RecipeCategory.builder()
                    .name(request.getName())
                    .build();
            return recipeCategoryRepository.save(category);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND);
        }
    }

    @Transactional
    public List<RecipeCategoryResDto> findAllRecipeCategory() {
        List<RecipeCategory> recipeCategories = recipeCategoryRepository.findAll();
        List<RecipeCategoryResDto> recipeCategoryResDtos = new ArrayList<>();
        for(RecipeCategory recipeCategory: recipeCategories) {
            recipeCategoryResDtos.add(RecipeCategoryResDto.toDto(recipeCategory));
        }
        return recipeCategoryResDtos;
    }
}
