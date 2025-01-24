package com.c108.springproject.item.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.dto.*;
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

    // 살품 생성
    @PostMapping("/")
    public ResponseDto createItem(@RequestBody ItemCreateReqDto itemCreateReqDto) {
        ItemCreateResDto resDto = itemService.createItem(itemCreateReqDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_ITEM, new DefaultResponse<>(resDto));
    }

    // 상품 전체 조회
    @GetMapping("/")
    public ResponseDto getAllItems() {
        List<ItemListResDto> items = itemService.getAllItems();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_ITEM, new DefaultResponse<>(items));
    }

    // 상품 상세 조회
    @GetMapping("/{itemNo}")
    public ResponseDto getItem(@PathVariable int itemNo) {
        ItemResDto item = itemService.getItem(itemNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ITEM, new DefaultResponse<>(item));
    }

    // 상품 수정
    @PutMapping("/{itemNo}")
    public ResponseDto updateItem(@PathVariable int itemNo, @RequestBody ItemUpdateReqDto reqDto) {
        ItemUpdateResDto updatedItem = itemService.updateItem(itemNo, reqDto);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_ITEM, new DefaultResponse<>(updatedItem));
    }
    
    // 상품 삭제
    @DeleteMapping("/{itemNo}")
    public ResponseEntity<Void> deleteItem(@PathVariable int itemNo) {
        itemService.deleteItem(itemNo);
        return ResponseEntity.noContent().build();
    }
}
