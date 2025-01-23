package com.c108.springproject.item.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.dto.ItemCreateReqDto;
import com.c108.springproject.item.dto.ItemCreateResDto;
import com.c108.springproject.item.dto.ItemReadResDto;
import com.c108.springproject.item.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/item")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @PostMapping("/")
    public ResponseEntity<ItemCreateResDto> createItem(@RequestBody ItemCreateReqDto itemCreateReqDto) {  // 매개변수와 반환 타입 수정
        ItemCreateResDto resDto = itemService.createItem(itemCreateReqDto);
        return ResponseEntity.ok(resDto);
    }
    
    // 전체 조회
    @GetMapping("/")
    public ResponseDto getAllItems() {
        List<ItemReadResDto> items = itemService.getAllItems();
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_QUESTION, new DefaultResponse<>(items));
    }

}
