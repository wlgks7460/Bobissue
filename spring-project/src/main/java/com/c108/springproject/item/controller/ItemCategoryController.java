package com.c108.springproject.item.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.dto.ItemCategoryReqDto;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.dto.ItemCategoryResDto;
import com.c108.springproject.item.dto.ItemResDto;
import com.c108.springproject.item.service.ItemCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class ItemCategoryController {

    // 질문 itemCategoryService 가 아니라 categoryService 자동완성 뜨는 이유
    private ItemCategoryService itemCategoryService;

    @Autowired
    public ItemCategoryController(ItemCategoryService itemCategoryService) {
        this.itemCategoryService = itemCategoryService;
    }

    // 생성
    @PostMapping("/")
    public ResponseDto createCategory(@RequestBody ItemCategoryReqDto itemCategoryReqDto) {
        ItemCategory itemCategory = itemCategoryService.createCategory(itemCategoryReqDto);
        // Object로 일단 모든 정보 담아왔어요
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_CATEGORY, new DefaultResponse<ItemCategory>(itemCategoryService.getCategory(itemCategory.getCategoryNo())));
    }

    // 카테고리 조회
    @GetMapping("/{categoryNo}")
    public ResponseDto getCategory(@PathVariable int categoryNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CATEGORY, new DefaultResponse<ItemCategory>(itemCategoryService.getCategory(categoryNo)));
    }

    // 전체 조회
    @GetMapping("/")
    public ResponseDto getAllCategories() {
        List<ItemCategoryResDto> categories = itemCategoryService.getAllCategories();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_CATEGORY, new DefaultResponse<>(categories));
    }

    // 카테고리 수정
    @PutMapping("/{categoryNo}")
    public ResponseDto updateCategory(
            @PathVariable int categoryNo,
            @RequestBody ItemCategoryReqDto dto) {
        ItemCategoryResDto updatedCategory = itemCategoryService.updateCategory(categoryNo, dto);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_CATEGORY, new DefaultResponse<>(updatedCategory));
    }

    // 삭제
    @DeleteMapping("/{categoryNo}")
    public ResponseEntity<Void> deleteCategory(@PathVariable int categoryNo) {
        itemCategoryService.deleteCategory(categoryNo);
        return ResponseEntity.noContent().build();
    }
}
