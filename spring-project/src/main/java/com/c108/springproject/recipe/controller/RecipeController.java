package com.c108.springproject.recipe.controller;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.recipe.dto.request.RecipeCreateReqDto;
import com.c108.springproject.recipe.dto.request.RecipeUpdateReqDto;
import com.c108.springproject.recipe.dto.response.RecipeCreateResDto;
import com.c108.springproject.recipe.dto.response.RecipeListResDto;
import com.c108.springproject.recipe.dto.response.RecipeUpdateResDto;
import com.c108.springproject.recipe.service.RecipeService;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/recipe")
public class RecipeController {

    public final RecipeService recipeService;


    public RecipeController(RecipeService recipeService) {
        this.recipeService = recipeService;
    }

    @PostMapping(value = "", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE
    })
    public ResponseDto createRecipe(
            @RequestPart(value = "recipeCreateReqDto") String recipeCreateReqDtoString,
            @RequestPart(value = "images", required = false)List<MultipartFile> images
        ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            RecipeCreateReqDto recipeCreateReqDto = objectMapper.readValue(recipeCreateReqDtoString, RecipeCreateReqDto.class);
            RecipeCreateResDto recipeCreateResDto = recipeService.createRecipe(recipeCreateReqDto, images);
            return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_RECIPE, new DefaultResponse<>(recipeCreateResDto));
        } catch (Exception e) {
            e.printStackTrace();
            throw new BobIssueException(ResponseCode.FAILED_CREATE_RECIPE);
        }

    }
    @PutMapping(value = "/{recipeNo}", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE
    })
    public ResponseDto updateRecipe(
            @PathVariable int recipeNo,
            @RequestPart(value = "recipeUpdateReqDto") String recipeUpdateReqDtoString,
            @RequestPart(value = "images", required = false)List<MultipartFile> images
    ) {
        try {
            // 디버깅 로그
//            System.out.println("Received update request for recipe: " + recipeNo);
//            System.out.println("Request body: " + recipeUpdateReqDtoString);

            ObjectMapper objectMapper = new ObjectMapper();
            // JSON 파싱 시 알 수 없는 속성 무시
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            RecipeUpdateReqDto recipeUpdateReqDto = objectMapper.readValue(recipeUpdateReqDtoString, RecipeUpdateReqDto.class);
            // 디버깅용 로그
//            System.out.println("Parsed DTO: " + recipeUpdateReqDto);

            RecipeUpdateResDto recipeUpdateResDto = recipeService.updateRecipe(recipeNo, recipeUpdateReqDto, images);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_RECIPE, new DefaultResponse<>(recipeUpdateResDto));
        } catch (Exception e) {
//            System.out.println("Error in updateRecipe: " + e.getMessage());
//            e.printStackTrace();
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_RECIPE);
        }
    }

    @GetMapping("")
    public ResponseDto getAllRecipe() {
        List<RecipeListResDto> recipe = recipeService.findAllRecipe();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_RECIPE, new DefaultResponse<>(recipe));
    }

    @GetMapping("/{recipeNo}")
    public ResponseDto getRecipe(@PathVariable int recipeNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_RECIPE, new DefaultResponse<>(recipeService.findRecipe(recipeNo)));
    }

    @DeleteMapping("/{recipeNo}")
    public ResponseDto deleteRecipe(@PathVariable int recipeNo) {
        recipeService.deleteRecipe(recipeNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_RECIPE, new DefaultResponse<>(null)
        );
    }


}
