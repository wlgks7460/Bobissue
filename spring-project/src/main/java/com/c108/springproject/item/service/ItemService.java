package com.c108.springproject.item.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.dto.*;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.review.domain.Review;
import jakarta.transaction.Transactional;
import lombok.Builder;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Date;
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
                .name(reqDto.getName())
                .price(reqDto.getPrice())
                .salePrice(reqDto.getSalePrice())
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
                        .createdAt(category.getCreatedAt())
                        .updatedAt(category.getUpdatedAt())
                        .build())
                .imageNo(savedItem.getImageNo())
                .companyNo(savedItem.getCompanyNo())
                .name(savedItem.getName())
                .price(savedItem.getPrice())
                .salePrice(savedItem.getSalePrice())
                .createdAt(savedItem.getCreatedAt())
                .createdUser(savedItem.getCreatedUser())
                .updatedAt(savedItem.getUpdatedAt())
                .updatedUser(savedItem.getUpdatedUser())
                .expiredAt(savedItem.getExpiredAt())
                .description(savedItem.getDescription())
                .stock(savedItem.getStock())
                .delYn(savedItem.getDelYn())
                .build();
    }

    // 전체 상품 조회
    @Transactional
    public List<ItemListResDto> getAllItems() {
        return itemRepository.findByDelYn("N").stream()
                .map(item -> ItemListResDto.builder()
                        .itemNo(item.getItemNo())
                        .categoryNo(item.getCategoryNo().getCategoryNo())
                        .name(item.getName())
                        .imageNo(item.getImageNo())
                        .companyNo(item.getCompanyNo())
                        .price(item.getPrice())
                        .salePrice(item.getSalePrice())
                        .description(item.getDescription())
                        .build())
                .collect(Collectors.toList());
    }


    // 상품 상세 조회
    @Transactional
    public ItemResDto getItem(int itemNo) {
        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
        ItemCategory category = item.getCategoryNo();
        return ItemResDto.builder()
                .itemNo(item.getItemNo())
                .category(ItemCategoryResDto.builder()
                        .categoryNo(category.getCategoryNo())
                        .name(category.getName())
                        .createdAt(category.getCreatedAt())
                        .updatedAt(category.getUpdatedAt())
                        .build())
                .imageNo(item.getImageNo())
                .companyNo(item.getCompanyNo())
                .name(item.getName())
                .price(item.getPrice())
                .salePrice(item.getSalePrice())
                .createdAt(item.getCreatedAt())
                .createdUser(item.getCreatedUser())
                .updatedAt(item.getUpdatedAt())
                .updatedUser(item.getUpdatedUser())
                .expiredAt(item.getExpiredAt())
                .description(item.getDescription())
                .stock(item.getStock())
                .delYn(item.getDelYn())
                .build();
    }


    // 상품 수정
    public ItemUpdateResDto updateItem(int itemNo, ItemUpdateReqDto reqDto) {
        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
        Item updatedItem = Item.builder()
                .itemNo(itemNo)
                .categoryNo(itemCategoryService.getCategory(reqDto.getCategoryNo()))
                .imageNo(reqDto.getImageNo())
                .companyNo(reqDto.getCompanyNo())
                .name(reqDto.getName())
                .price(reqDto.getPrice())
                .salePrice(reqDto.getSalePrice())
                .expiredAt(reqDto.getExpiredAt())
                .description(reqDto.getDescription())
                .stock(reqDto.getStock())
                .build();

        // Item 클래스의 BaseEntity 상속부분에서 createdAt과 updatedAt을 상속했기 때문에 builder 패턴에서 직접 접근X.
        updatedItem.setCreatedAt(item.getCreatedAt());
        String currentDate = new SimpleDateFormat("yyyyMMdd HHmmss").format(new Date());
        updatedItem.setUpdatedAt(currentDate);

        Item savedItem = itemRepository.save(updatedItem);
        ItemCategory category = savedItem.getCategoryNo();

        return ItemUpdateResDto.builder()
                .itemNo(updatedItem.getItemNo())
                .category(ItemCategoryResDto.builder()
                        .categoryNo(category.getCategoryNo())
                        .name(category.getName())
                        .createdAt(category.getCreatedAt())
                        .updatedAt(category.getUpdatedAt())
                        .build())
                .imageNo(updatedItem.getImageNo())
                .companyNo(updatedItem.getCompanyNo())
                .name(updatedItem.getName())
                .price(updatedItem.getPrice())
                .salePrice(updatedItem.getSalePrice())
                .createdAt(updatedItem.getCreatedAt())
                .createdUser(updatedItem.getCreatedUser())
                .updatedAt(updatedItem.getUpdatedAt())
                .updatedUser(updatedItem.getUpdatedUser())
                .expiredAt(updatedItem.getExpiredAt())
                .description(updatedItem.getDescription())
                .stock(updatedItem.getStock())
                .delYn(updatedItem.getDelYn())
                .build();
    }


    // 상품 삭제
    @Transactional
    public void deleteItem(int itemNo) {
        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
        item.delete();
        itemRepository.save(item);
    }
}


