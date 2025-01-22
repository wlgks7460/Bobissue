package com.c108.springproject.items.service;

import com.c108.springproject.items.domain.Item;
import com.c108.springproject.items.dto.ItemCreateReqDto;
import com.c108.springproject.items.repository.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigInteger;

@Service
public class ItemService {

    private final ItemRepository itemRepository;


    public ItemService(ItemRepository itemRepository) {
        this.itemRepository = itemRepository;
    }

    @Transactional
    public Item createItem(ItemCreateReqDto itemCreateReqDto) {
        Item new_item = Item.builder()
                .categoryNo(1)
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
