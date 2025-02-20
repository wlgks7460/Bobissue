package com.c108.springproject.item.controller;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.dto.request.ItemCreateReqDto;
import com.c108.springproject.item.dto.request.ItemUpdateReqDto;
import com.c108.springproject.item.dto.request.SearchReqDto;
import com.c108.springproject.item.dto.response.*;
import com.c108.springproject.item.service.ItemService;
import com.fasterxml.jackson.core.JsonProcessingException;
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

    // 상품 생성
    @PostMapping(value = "",consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE  // 이걸 추가
    })
    public ResponseDto createItem(
            @RequestPart(value = "item") String itemString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ItemCreateReqDto itemCreateReqDto = objectMapper.readValue(itemString, ItemCreateReqDto.class);
            ItemCreateResDto resDto = itemService.createItem(itemCreateReqDto, images);
            return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_ITEM, new DefaultResponse<>(resDto));
        } catch (BobIssueException e) {
            e.printStackTrace();
            throw e;
        } catch (Exception e) {
            try {
                throw e;
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    // 상품 전체 조회
    @GetMapping("")
    public ResponseDto getAllItems() {
        try {
            List<ItemListResDto> items = itemService.getAllItems();
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_ITEM, new DefaultResponse<>(items));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    // 상품 상세 조회
    @GetMapping("/{itemNo}")
    public ResponseDto getItem(@PathVariable int itemNo) {
        try {
            ItemResDto item = itemService.getItem(itemNo);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ITEM, new DefaultResponse<>(item));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    // 상품 수정
    @PutMapping(value = "/{itemNo}", consumes = {
            MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE
    })
    public ResponseDto updateItem(
            @PathVariable int itemNo,
            @RequestPart(value = "item") String itemString,
            @RequestPart(value = "images", required = false) List<MultipartFile> images
    ) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            ItemUpdateReqDto reqDto = objectMapper.readValue(itemString, ItemUpdateReqDto.class);

            ItemUpdateResDto updatedItem = itemService.updateItem(itemNo, reqDto, images);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_ITEM, new DefaultResponse<>(updatedItem));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            try {
                throw e;
            } catch (JsonProcessingException ex) {
                throw new RuntimeException(ex);
            }
        }
    }

    // 상품 삭제
    @DeleteMapping("/{itemNo}")
    public ResponseDto deleteItem(@PathVariable int itemNo) {
        try {
            itemService.deleteItem(itemNo);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_ITEM, new DefaultResponse<>(itemNo));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    // 상품 찜
    @PostMapping("/{itemNo}/like")
    public ResponseDto addLike(@PathVariable int itemNo) {
        try {
            itemService.addLike(itemNo);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_CREATE_LIKE, new DefaultResponse<>(itemNo));
        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @DeleteMapping("/{itemNo}/like")
    public ResponseDto removeLike(@PathVariable int itemNo) {
        try {

            itemService.removeLike(itemNo);
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_LIKE, new DefaultResponse<>(itemNo));

        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("/like")
    public ResponseDto getLikedItems() {
        try {
            List<ItemListResDto> items = itemService.getLikedItems();
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_LIKES, new DefaultResponse<>(items));

        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw e;
        }
    }

    @GetMapping("/like-search")
    public ResponseDto likeSearchItems(@RequestBody SearchReqDto reqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_SEARCH, new DefaultResponse<SearchResDto>(itemService.searchItems(reqDto)));
    }


    @GetMapping("/search")
    public ResponseDto searchItems(@RequestBody SearchReqDto reqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_SEARCH, new DefaultResponse<SearchResDto>(itemService.elasticSearchItems(reqDto)));
    }

    // SQL에 있는 데이터를 엘라스틱으로 저장
    @GetMapping("/dataToElastic")
    public ResponseDto searchItems(){
        itemService.syncAllItemsToElastic();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_CREATE_ITEM,  null);
    }

    // 통계
    // 재구매율 높은 상품
    @GetMapping("/top-repurchase")
    public ResponseDto getTopRepurchaseItems() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_TOP_REPURCHASE_ITEM, new DefaultResponse<>(itemService.getTopRepurchaseItems()));
    }
    
    // 남성 선호
    @GetMapping("/male-preferred")
    public ResponseDto getMalePrefferredItems() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_MALE_PREFERRED_ITEM, new DefaultResponse<>(itemService.getMalePreferredItems()));
    }

    // 여성 선호
    @GetMapping("/female-preferred")
    public ResponseDto getFemalePreferredItems() {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_FEMALE_PREFERRED_ITEM,
                new DefaultResponse<>(itemService.getFemalePreferredItems()));
    }

    @GetMapping("/gender-preference")
    public ResponseDto getItemsByGenderPreference() {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_GENDER_PREFERENCE,
                new DefaultResponse<>(itemService.getItemsByGenderPreference())
        );
    }

    @GetMapping("/best-sellers")
    public ResponseDto getBestSellerItems() {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_BEST_SELLERS,
                new DefaultResponse<>(itemService.getBestSellerItems())
        );
    }

    // 카테고리 + 성별/연령대 기반 추천
    @GetMapping("/{itemNo}/recommendations/demographic")
    public ResponseDto getRecommendationsByCategoryAndDemographic(@PathVariable Integer itemNo) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_RECOMMENDATIONS_BY_DEMOGRAPHIC,
                new DefaultResponse<>(itemService.getRecommendationsByCategoryAndDemographic(itemNo))
        );
    }

    // 구매 이력 기반 필터링
    @GetMapping("/{itemNo}/recommendations/collaborative")
    public ResponseDto getRecommendationsByCollaborativeFiltering(@PathVariable Integer itemNo) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_RECOMMENDATIONS_BY_COLLABORATIVE,
                new DefaultResponse<>(itemService.getRecommendationsByCollaborativeFiltering(itemNo))
        );
    }

    // 레시피 기반 추천
    @GetMapping("/{itemNo}/recommendations/recipe")
    public ResponseDto getRecommendationsByRecipe(@PathVariable Integer itemNo) {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_FIND_RECOMMENDATIONS_BY_RECIPE,
                new DefaultResponse<>(itemService.getRecommendationsByRecipe(itemNo))
        );
    }

}
