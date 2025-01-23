package com.c108.springproject.item.service;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.dto.ItemCreateReqDto;
import com.c108.springproject.item.repository.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigInteger;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemCategoryService itemCategoryService;


    public ItemService(ItemRepository itemRepository, ItemCategoryService itemCategoryService) {

        this.itemRepository = itemRepository;
        this.itemCategoryService = itemCategoryService;

    }

    @Transactional
    public Item createItem(ItemCreateReqDto itemCreateReqDto) {
        // 카테고리 가져오기
        ItemCategory category = itemCategoryService.getCategory(itemCreateReqDto.getCategoryNo());

        Item new_item = Item.builder()
                .categoryNo(category)
                .imageNo(BigInteger.valueOf(1))
                .companyNo(1)
                .price(itemCreateReqDto.getPrice())
                .salePrice(itemCreateReqDto.getSalePrice())
                .createdAt(itemCreateReqDto.getCreatedAt())
                .updatedAt(itemCreateReqDto.getUpdatedAt())
                .expiredAt(itemCreateReqDto.getExpiredAt())
                .description(itemCreateReqDto.getDescription())
                .stock(itemCreateReqDto.getStock())
                .build();
        return itemRepository.save(new_item);
    }

}
