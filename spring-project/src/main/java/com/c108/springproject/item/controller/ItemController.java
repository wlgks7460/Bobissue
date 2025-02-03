package com.c108.springproject.item.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.dto.request.ItemCreateReqDto;
import com.c108.springproject.item.dto.request.ItemUpdateReqDto;
import com.c108.springproject.item.dto.response.ItemCreateResDto;
import com.c108.springproject.item.dto.response.ItemListResDto;
import com.c108.springproject.item.dto.response.ItemResDto;
import com.c108.springproject.item.dto.response.ItemUpdateResDto;
import com.c108.springproject.item.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/items")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // 살품 생성
    @PostMapping(consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseDto createItem(
            @RequestPart ItemCreateReqDto itemCreateReqDto,
            @RequestPart(required = false) List<MultipartFile> images) {
        ItemCreateResDto resDto = itemService.createItem(itemCreateReqDto, images);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_ITEM, new DefaultResponse<>(resDto));
    }

    // 상품 전체 조회
    @GetMapping("")
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
    @PutMapping(value = "/{itemNo}", consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseDto updateItem(
            @PathVariable int itemNo,
            @RequestPart ItemUpdateReqDto reqDto,
            @RequestPart(required = false) List<MultipartFile> images) {
        ItemUpdateResDto updatedItem = itemService.updateItem(itemNo, reqDto, images);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_ITEM, new DefaultResponse<>(updatedItem));
    }
    
    // 상품 삭제
    @DeleteMapping("/{itemNo}")
    public ResponseEntity<Void> deleteItem(@PathVariable int itemNo) {
        itemService.deleteItem(itemNo);
        return ResponseEntity.noContent().build();
    }
}
