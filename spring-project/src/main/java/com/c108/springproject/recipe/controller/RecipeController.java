package com.c108.springproject.recipe.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.recipe.dto.request.RecipeCreateReqDto;
import com.c108.springproject.recipe.dto.request.RecipeUpdateReqDto;
import com.c108.springproject.recipe.service.RecipeService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/recipe")
public class RecipeController {

    public final RecipeService recipeService;


    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping("")
    public ResponseDto createRecipe(@RequestBody RecipeCreateReqDto recipeCreateReqDto) {
        return new ResponseDto(
                HttpStatus.CREATED,
                ResponseCode.SUCCESS_CREATE_RECIPE,
                new DefaultResponse<>(recipeService.createRecipe(recipeCreateReqDto))
        );
    }
    @PutMapping("/{recipeNo}")
    public ResponseDto updateRecipe(@PathVariable int recipeNo, @RequestBody RecipeUpdateReqDto recipeUpdateReqDto) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_UPDATE_RECIPE,
                new DefaultResponse<>(recipeService.updateRecipe(recipeNo, recipeUpdateReqDto))
        );
    }



}
