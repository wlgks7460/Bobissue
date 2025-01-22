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


    public ItemService(ItemRepository itemRepository, ItemCategoryService itemCategoryService, ItemCategoryService itemCategoryService1) {

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
                .price(123123)
                .salePrice(111111)
                .createdAt("2020-01-10")
                .updatedAt("2020-01-10")
                .expiredAt(itemCreateReqDto.getExpiredAt())
                .description(itemCreateReqDto.getDescription())
                .stock(itemCreateReqDto.getStock())
                .build();
        return itemRepository.save(new_item);
    }

}
