package com.c108.springproject.item.service;

import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.dto.ItemCategoryReqDto;
import com.c108.springproject.item.dto.ItemCategoryResDto;
import com.c108.springproject.item.repository.ItemCategoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCategoryService {

    private final ItemCategoryRepository itemcategoryRepository;

    public ItemCategoryService(ItemCategoryRepository categoryRepository) {
        this.itemcategoryRepository = categoryRepository;
    }

    // 카테고리 만들기
    public ItemCategory createCategory(ItemCategoryReqDto dto) {
        
        // 날짜 가져오기
        // 글로벌 쓰는 법을 모르겠어여
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        
        ItemCategory new_category = ItemCategory.builder()
                .name(dto.getName())
                .createdAt(currentDate)
                .updatedAt(currentDate)
                .build();
        return itemcategoryRepository.save(new_category);
    }

    // 카테고리 전체 조회
    public List<ItemCategoryResDto> getAllCategories() {
        return itemcategoryRepository.findAll().stream()
                .map(itemCategory -> ItemCategoryResDto.builder()  // 이 부분에서 ItemCategoryReqDto -> ItemCategoryResDto로 변경
                        .categoryNo(itemCategory.getCategoryNo())
                        .name(itemCategory.getName())
                        .createdAt(itemCategory.getCreatedAt())
                        .updatedAt(itemCategory.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());  // 괄호 수정
    }


    // id 받아서 카테고리 정보 조회
    public ItemCategory getCategory(int categoryNo) {
        return itemcategoryRepository.findById(categoryNo).orElse(null);
        // 예외처리 질문
    }

    
    // 수정하기
    public ItemCategory updateCategory(int categoryNo, ItemCategoryReqDto dto) {
        ItemCategory category = getCategory(categoryNo);
        // 날짜 가져오기
        // 글로벌 쓰는 법을 모르겠어여
        String currentDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));

        ItemCategory updatedCategory = ItemCategory.builder()
                .categoryNo(category.getCategoryNo())
                .name(dto.getName())
                .createdAt(currentDate)
                .updatedAt(currentDate)
                .build();
        return itemcategoryRepository.save(updatedCategory);
    }
    
    
    // delete void로 반환하는 것은 반환 값이 필요 없음
    public void deleteCategory(int categoryNo) {
        if (itemcategoryRepository.existsById(categoryNo)) {
            itemcategoryRepository.deleteById(categoryNo);
        }
    }

}
