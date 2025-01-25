package com.c108.springproject.recipe.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.recipe.domain.RecipeCategory;
import com.c108.springproject.recipe.dto.request.RecipeCategoryReqDto;
import com.c108.springproject.recipe.dto.response.RecipeCategoryResDto;
import com.c108.springproject.recipe.service.RecipeCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipecategory")
public class RecipeCategoryController {
    private final RecipeCategoryService recipeCategoryService;

    public RecipeCategoryController(RecipeCategoryService recipeCategoryService) {
        this.recipeCategoryService = recipeCategoryService;
    }

    @PostMapping("")
    public ResponseDto createRecipeCategory(@RequestBody RecipeCategoryReqDto recipeCategoryReqDto) {
        RecipeCategory recipeCategory = recipeCategoryService.createCategory(recipeCategoryReqDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_RECIPECATEGORY, new DefaultResponse<Object>(recipeCategory));
    }

    @GetMapping("")
    public ResponseDto findAllRecipeCategory() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CATEGORY, new DefaultResponse<List>(recipeCategoryService.findAllRecipeCategory()));
    }
}
