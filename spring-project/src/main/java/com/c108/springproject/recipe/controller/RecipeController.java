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
import com.fasterxml.jackson.core.JsonProcessingException;
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
            @RequestPart(value = "recipe") String recipeString,
            @RequestPart(value = "images", required = false)List<MultipartFile> images
        ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            RecipeCreateReqDto recipeCreateReqDto = objectMapper.readValue(recipeString, RecipeCreateReqDto.class);
            RecipeCreateResDto recipeCreateResDto = recipeService.createRecipe(recipeCreateReqDto, images);
            return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_RECIPE, new DefaultResponse<>(recipeCreateResDto));
        } catch (BobIssueException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            try {
                throw e;
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }

    }
    @PutMapping(value = "/{recipeNo}", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE
    })
    public ResponseDto updateRecipe(
            @PathVariable int recipeNo,
            @RequestPart(value = "recipe") String recipeString,
            @RequestPart(value = "images", required = false)List<MultipartFile> images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            // JSON 파싱 시 알 수 없는 속성 무시
            objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

            RecipeUpdateReqDto recipeUpdateReqDto = objectMapper.readValue(recipeString, RecipeUpdateReqDto.class);
            // 디버깅용 로그
//            System.out.println("Parsed DTO: " + recipeUpdateReqDto);
            RecipeUpdateResDto recipeUpdateResDto = recipeService.updateRecipe(recipeNo, recipeUpdateReqDto, images);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_RECIPE, new DefaultResponse<>(recipeUpdateResDto));
        } catch (BobIssueException e) {
//            System.out.println("Error in updateRecipe: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            try {
                throw e;
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    @GetMapping("")
    public ResponseDto getAllRecipe() {
        try {
            List<RecipeListResDto> recipe = recipeService.findAllRecipe();
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_RECIPE, new DefaultResponse<>(recipe));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("/{recipeNo}")
    public ResponseDto getRecipe(@PathVariable int recipeNo) {
        try {
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_RECIPE, new DefaultResponse<>(recipeService.findRecipe(recipeNo)));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @DeleteMapping("/{recipeNo}")
    public ResponseDto deleteRecipe(@PathVariable int recipeNo) {
        try {
            recipeService.deleteRecipe(recipeNo);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_RECIPE, new DefaultResponse<>(null)
            );
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @PostMapping("{recipeNo}/like")
    public ResponseDto likeRecipe(@PathVariable int recipeNo) {
        try {
            recipeService.addLike(recipeNo);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_CREATE_LIKE, new DefaultResponse<>(recipeNo));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }


    @DeleteMapping("{recipeNo}/like")
    public ResponseDto removeLike(@PathVariable int recipeNo) {
        try {
            recipeService.removeLike(recipeNo);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_LIKE, new DefaultResponse<>(recipeNo));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }


    @GetMapping("/like")
    public ResponseDto getLikedRecipe() {
        try {
            List<RecipeListResDto> recipes = recipeService.getLikedRecipe();
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_LIKES, new DefaultResponse<>(recipes));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }


}
