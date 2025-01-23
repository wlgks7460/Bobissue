package com.c108.springproject.item.controller;

import com.c108.springproject.item.dto.ItemCategoryReqDto;
import com.c108.springproject.item.domain.ItemCategory;
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
    public ResponseEntity<ItemCategory> createCategory(@RequestBody ItemCategoryReqDto dto) {
        return ResponseEntity.ok(itemCategoryService.createCategory(dto));
    }

    // 카테고리 조회
    @GetMapping("/{categoryNo}")
    public ResponseEntity<ItemCategory> getCategory(@PathVariable int categoryNo) {
        return ResponseEntity.ok(itemCategoryService.getCategory(categoryNo));
    }

    // 전체 조회
    @GetMapping("/")
    public ResponseEntity<List<ItemCategory>> getAllCategories() {
        return ResponseEntity.ok(itemCategoryService.getAllCategories());
    }

    // 카테고리 수정
    @PutMapping("/{categoryNo}")
    public ResponseEntity<ItemCategory> updateCategory(
            @PathVariable int categoryNo,
            @RequestBody ItemCategoryReqDto dto) {
        return ResponseEntity.ok(itemCategoryService.updateCategory(categoryNo, dto));
    }

    // 삭제
    @DeleteMapping("/{categoryNo}")
    public ResponseEntity<Void> deleteCategory(@PathVariable int categoryNo) {
        itemCategoryService.deleteCategory(categoryNo);
        return ResponseEntity.noContent().build();
    }


}
