package com.c108.springproject.recipe.service;


import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.recipe.domain.RecipeCategory;
import com.c108.springproject.recipe.dto.request.RecipeCategoryReqDto;
import com.c108.springproject.recipe.dto.response.RecipeCategoryResDto;
import com.c108.springproject.recipe.repository.RecipeCategoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecipeCategoryService {

    private final RecipeCategoryRepository recipeCategoryRepository;

    public RecipeCategoryService(RecipeCategoryRepository recipeCategoryRepository) {
        this.recipeCategoryRepository = recipeCategoryRepository;
    }
    
    // 생성
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
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

    // 전체 조회
    @Transactional
    public List<RecipeCategoryResDto> findAllRecipeCategory() {
        List<RecipeCategory> recipeCategories = recipeCategoryRepository.findAll();
        List<RecipeCategoryResDto> recipeCategoryResDtos = new ArrayList<>();
        for(RecipeCategory recipeCategory: recipeCategories) {
            recipeCategoryResDtos.add(RecipeCategoryResDto.toDto(recipeCategory));
        }
        return recipeCategoryResDtos;
    }
    
    // 상세 조회
    @Transactional
    public RecipeCategory findRecipeCategoryByNo(int recipeCategoryNo) {
        return recipeCategoryRepository.findById(recipeCategoryNo).orElseThrow(() -> new BobIssueException(ResponseCode.RECIPECATEGORY_NOT_FOUND));
    }

    //수정
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public RecipeCategoryResDto updateRecipeCategory(int recipeCategoryNo, RecipeCategoryReqDto recipeCategoryReqDto ) {
        RecipeCategory recipeCategory = recipeCategoryRepository.findById(recipeCategoryNo).orElseThrow(() -> new BobIssueException(ResponseCode.RECIPECATEGORY_NOT_FOUND));
        try {
            RecipeCategory updatedCategory = RecipeCategory.builder()
                    .categoryNo(recipeCategory.getCategoryNo())
                    .name(recipeCategoryReqDto.getName())
                    .build();
            return RecipeCategoryResDto.toDto(updatedCategory);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_CATEGORY);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public int deleteRecipeCategory(int recipeCategoryNo) {
        RecipeCategory recipeCategory = recipeCategoryRepository.findById(recipeCategoryNo).orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_CATEGORY));
        try {
            recipeCategory.delete();
            return recipeCategoryNo;
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.NOT_FOUND_CATEGORY);
        }
    }

}
