package com.c108.springproject.item.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.dto.request.ItemCategoryReqDto;
import com.c108.springproject.item.dto.response.ItemCategoryListResDto;
import com.c108.springproject.item.dto.response.ItemCategoryResDto;
import com.c108.springproject.item.repository.ItemCategoryRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemCategoryService {

    private final ItemCategoryRepository itemcategoryRepository;

    public ItemCategoryService(ItemCategoryRepository categoryRepository) {
        this.itemcategoryRepository = categoryRepository;
    }

    // 카테고리 만들기
    @Transactional
    public ItemCategory createCategory(ItemCategoryReqDto dto) {
        // 상위 카테고리는 parentNo가 null
        ItemCategory parentCategory = null;
        if (dto.getParentNo() != null) {
            parentCategory = itemcategoryRepository.findById(dto.getParentNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));
        }

        ItemCategory new_category = ItemCategory.builder()
                .name(dto.getName())
                .parent(parentCategory)
                .build();
        return itemcategoryRepository.save(new_category);
    }

    // 카테고리 전체 조회
    @Transactional
    public List<ItemCategoryListResDto> getAllCategories() {
        return itemcategoryRepository.findByParentIsNull().stream()
                .map(ItemCategoryListResDto::toDto)
                .collect(Collectors.toList());

    }


    // id 받아서 카테고리 정보 조회
    @Transactional
    public ItemCategoryResDto getCategory(int categoryNo) {
        ItemCategory category = itemcategoryRepository.findById(categoryNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));

        // 원본 아이템 리스트 보존을 위해 새로운 리스트 생성
        List<Item> allItems = new ArrayList<>(category.getItems());

        // 하위 카테고리들의 아이템들을 모두 추가
        category.getChildren().forEach(childCategory ->
                allItems.addAll(childCategory.getItems())
        );

        // 원본 카테고리의 아이템 리스트를 모든 아이템이 포함된 리스트로 교체
        category.setItems(allItems);

        return ItemCategoryResDto.toDto(category);
    }

    
    // 카테고리 수정
    @Transactional
    public ItemCategoryResDto updateCategory(int categoryNo, ItemCategoryReqDto dto) {
        ItemCategory category = itemcategoryRepository.findById(categoryNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));

        category.setName(dto.getName());

        return ItemCategoryResDto.toDto(category);
    }
    
    
    // delete void로 반환하는 것은 반환 값이 필요 없음
    @Transactional
    public void deleteCategory(int categoryNo) {
        if (itemcategoryRepository.existsById(categoryNo)) {
            itemcategoryRepository.deleteById(categoryNo);
        }
    }

}
