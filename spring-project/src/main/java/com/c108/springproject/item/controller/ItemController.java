package com.c108.springproject.item.controller;

import com.c108.springproject.global.BobIssueException;
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
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
@RequestMapping("/api/item")
public class ItemController {

    private final ItemService itemService;

    @Autowired
    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    // 살품 생성
    @PostMapping(value = "",consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE  // 이걸 추가
    })
    public ResponseDto createItem(
            @RequestPart(value = "itemCreateReqDto") String itemCreateReqDtoString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ItemCreateReqDto itemCreateReqDto = objectMapper.readValue(itemCreateReqDtoString, ItemCreateReqDto.class);
            ItemCreateResDto resDto = itemService.createItem(itemCreateReqDto, images);
            return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_ITEM, new DefaultResponse<>(resDto));
        } catch (Exception e) {
            e.printStackTrace();
            throw new BobIssueException(ResponseCode.FILE_UPLOAD_ERROR);
        }
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
    @PutMapping(value = "/{itemNo}", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE
    })
    public ResponseDto updateItem(
            @PathVariable int itemNo,
            @RequestPart(value = "itemUpdateReqDto") String itemUpdateReqDtoString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ItemUpdateReqDto reqDto = objectMapper.readValue(itemUpdateReqDtoString, ItemUpdateReqDto.class);

            ItemUpdateResDto updatedItem = itemService.updateItem(itemNo, reqDto, images);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_ITEM, new DefaultResponse<>(updatedItem));
        } catch (Exception e) {
            e.printStackTrace();
            throw new BobIssueException(ResponseCode.FILE_UPLOAD_ERROR);
        }
    }
    
    // 상품 삭제
    @DeleteMapping("/{itemNo}")
    public ResponseDto deleteItem(@PathVariable int itemNo) {
        itemService.deleteItem(itemNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_ITEM, new DefaultResponse<>(itemNo));
    }
}
