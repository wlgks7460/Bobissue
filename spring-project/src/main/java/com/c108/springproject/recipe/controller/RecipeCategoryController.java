package com.c108.springproject.recipe.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.dto.ItemCategoryReqDto;
import com.c108.springproject.item.dto.ItemCategoryResDto;
import com.c108.springproject.recipe.domain.RecipeCategory;
import com.c108.springproject.recipe.dto.request.RecipeCategoryReqDto;
import com.c108.springproject.recipe.dto.response.RecipeCategoryResDto;
import com.c108.springproject.recipe.service.RecipeCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recipecategory")
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeCategoryController {
    private final RecipeCategoryService recipeCategoryService;

    public RecipeCategoryController(RecipeCategoryService recipeCategoryService) {
        this.recipeCategoryService = recipeCategoryService;
    }

    // 레시피 카테고리 생성
    @PostMapping("")
    public ResponseDto createRecipeCategory(@RequestBody RecipeCategoryReqDto recipeCategoryReqDto) {
        RecipeCategory recipeCategory = recipeCategoryService.createCategory(recipeCategoryReqDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_RECIPECATEGORY, new DefaultResponse<Object>(recipeCategory));
    }

    // 레시피 카테고리 전체 조회
    @GetMapping("")
    public ResponseDto findAllRecipeCategory() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CATEGORY, new DefaultResponse<List>(recipeCategoryService.findAllRecipeCategory()));
    }


    // 레시피 카테고리 상세 조회
    @GetMapping("/{recipeCategoryNo}")
    public ResponseDto getRecipeCategoryByNo(@PathVariable int recipeCategoryNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ITEM, new DefaultResponse<RecipeCategory>(recipeCategoryService.findRecipeCategoryByNo(recipeCategoryNo)));
    }

    @PutMapping("/{recipeCategoryNo}")
    public ResponseDto updateRecipeCategory(
            @PathVariable int recipeCategoryNo,
            @RequestBody RecipeCategoryReqDto dto) {
        RecipeCategoryResDto updatedCategory = recipeCategoryService.updateRecipeCategory(recipeCategoryNo, dto);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_CATEGORY, new DefaultResponse<>(updatedCategory));
    }

    @DeleteMapping("/{recipeCategoryNo}")
    public ResponseDto deleteRecipeCategory(@PathVariable int recipeCategoryNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_CATEGORY, new DefaultResponse<Integer>(recipeCategoryService.deleteRecipeCategory(recipeCategoryNo)));
    }
}
