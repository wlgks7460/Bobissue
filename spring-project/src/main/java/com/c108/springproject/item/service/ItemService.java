package com.c108.springproject.item.service;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.dto.ItemCreateReqDto;
import com.c108.springproject.item.dto.ItemCategoryResDto;
import com.c108.springproject.item.dto.ItemCreateResDto;
import com.c108.springproject.item.dto.ItemReadResDto;
import com.c108.springproject.item.repository.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemCategoryService itemCategoryService;


    public ItemService(ItemRepository itemRepository, ItemCategoryService itemCategoryService) {

        this.itemRepository = itemRepository;
        this.itemCategoryService = itemCategoryService;

    }

    // 상품 생성
    @Transactional
    public ItemCreateResDto createItem(ItemCreateReqDto reqDto) {
        // 카테고리 존재 확인 및 가져오기
        ItemCategory category = itemCategoryService.getCategory(reqDto.getCategoryNo());

        // Item 엔티티 생성 및 저장
        Item savedItem = itemRepository.save(Item.builder()
                .categoryNo(category)
                .imageNo(reqDto.getImageNo())
                .companyNo(reqDto.getCompanyNo())
                .price(reqDto.getPrice())
                .salePrice(reqDto.getSalePrice())
                .createdAt(reqDto.getCreatedAt())
                .updatedAt(reqDto.getUpdatedAt())
                .expiredAt(reqDto.getExpiredAt())
                .description(reqDto.getDescription())
                .stock(reqDto.getStock())
                .build());

        // ResponseDto로 변환하여 반환
        return ItemCreateResDto.builder()
                .itemNo(savedItem.getItemNo())
                .category(ItemCategoryResDto.builder()
                        .categoryNo(category.getCategoryNo())
                        .name(category.getName())
//                        .createdAt(category.getCreatedAt())
//                        .updatedAt(category.getUpdatedAt())
                        .build())
                .imageNo(savedItem.getImageNo())
                .companyNo(savedItem.getCompanyNo())
                .price(savedItem.getPrice())
                .salePrice(savedItem.getSalePrice())
                .createdAt(savedItem.getCreatedAt())
                .updatedAt(savedItem.getUpdatedAt())
                .expiredAt(savedItem.getExpiredAt())
                .description(savedItem.getDescription())
                .stock(savedItem.getStock())
                .build();
    }

    // 전체 상품 조회
    public List<ItemReadResDto> getAllItems() {
        return itemRepository.findAll().stream()
                .map(item -> ItemReadResDto.builder()
                        .itemNo(item.getItemNo())
                        .categoryNo(item.getCategoryNo().getCategoryNo())
                        .imageNo(item.getImageNo())
                        .companyNo(item.getCompanyNo())
                        .price(item.getPrice())
                        .salePrice(item.getSalePrice())
                        .createdAt(item.getCreatedAt())
                        .updatedAt(item.getUpdatedAt())
                        .expiredAt(item.getExpiredAt())
                        .description(item.getDescription())
                        .stock(item.getStock())
                        .build())
                .collect(Collectors.toList());
    }

}
