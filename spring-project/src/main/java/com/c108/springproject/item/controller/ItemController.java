package com.c108.springproject.item.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.dto.ItemCreateReqDto;
import com.c108.springproject.item.dto.ItemCreateResDto;
import com.c108.springproject.item.dto.ItemListResDto;
import com.c108.springproject.item.dto.ItemResDto;
import com.c108.springproject.item.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    // 전체 조회
    @GetMapping("/")
    public ResponseDto getAllItems() {
        List<ItemListResDto> items = itemService.getAllItems();
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_QUESTION, new DefaultResponse<>(items));
    }

    // 상세 조회
    @GetMapping("/{itemNo}")
    public ResponseDto getItem(@PathVariable int itemNo) {
        ItemResDto item = itemService.getItem(itemNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ITEM, new DefaultResponse<>(item));
    }

}
