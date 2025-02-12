package com.c108.springproject.recipe.controller;

import com.c108.springproject.global.BobIssueException;
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

    // 레시피 카테고리 생성
    @PostMapping("")
    public ResponseDto createRecipeCategory(@RequestBody RecipeCategoryReqDto recipeCategoryReqDto) {
        try {
            RecipeCategory recipeCategory = recipeCategoryService.createCategory(recipeCategoryReqDto);
            return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_RECIPECATEGORY, new DefaultResponse<Object>(recipeCategory));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    // 레시피 카테고리 전체 조회 인증X
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
        try {
            RecipeCategoryResDto updatedCategory = recipeCategoryService.updateRecipeCategory(recipeCategoryNo, dto);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_CATEGORY, new DefaultResponse<>(updatedCategory));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @DeleteMapping("/{recipeCategoryNo}")
    public ResponseDto deleteRecipeCategory(@PathVariable int recipeCategoryNo) {
        try {
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_CATEGORY, new DefaultResponse<Integer>(recipeCategoryService.deleteRecipeCategory(recipeCategoryNo)));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }
}
