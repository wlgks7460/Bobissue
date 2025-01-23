package com.c108.springproject.item.controller;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.dto.ItemCreateReqDto;
import com.c108.springproject.item.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/item")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/")
    public ResponseEntity<Item> createItem(@RequestBody ItemCreateReqDto itemCreateReqDto) {

        Item item = itemService.createItem(itemCreateReqDto);
        return ResponseEntity.ok(item);
    }

}
