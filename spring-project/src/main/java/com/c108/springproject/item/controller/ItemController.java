package com.c108.springproject.item.controller;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.dto.ItemCreateReqDto;
import com.c108.springproject.item.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/item")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/")
    public String createItem() {
        ItemCreateReqDto new_item = new ItemCreateReqDto();
        new_item.setPrice(123123);
        new_item.setSalePrice(111111);
        new_item.setExpiredAt("2099-99-99");
        new_item.setDescription("생략");
//        new_item.stock();
        Item item = itemService.createItem(new_item);
        return "item";
    }
}
