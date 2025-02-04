package com.c108.springproject.item.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.domain.ItemImage;
import com.c108.springproject.item.dto.request.ItemCreateReqDto;
import com.c108.springproject.item.dto.request.ItemUpdateReqDto;
import com.c108.springproject.item.dto.response.*;
import com.c108.springproject.item.repository.ItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemCategoryService itemCategoryService;
    private final S3Service s3Service;


    public ItemService(ItemRepository itemRepository, ItemCategoryService itemCategoryService, S3Service s3Service) {

        this.itemRepository = itemRepository;
        this.itemCategoryService = itemCategoryService;
        this.s3Service = s3Service;
    }

    // 상품 생성
    @Transactional
    // Item 생성 메서드
    public ItemCreateResDto createItem(ItemCreateReqDto reqDto, List<MultipartFile> files) {
        // 1. 카테고리 존재 확인 및 가져오기
        ItemCategory category = itemCategoryService.getCategory(reqDto.getCategoryNo());

        // 2. Item 엔티티 생성
        Item item = Item.builder()
                .categoryNo(category)
                .companyNo(reqDto.getCompanyNo())
                .name(reqDto.getName())
                .price(reqDto.getPrice())
                .salePrice(reqDto.getSalePrice())
                .expiredAt(reqDto.getExpiredAt())
                .description(reqDto.getDescription())
                .stock(reqDto.getStock())
                .images(new ArrayList<>())
                .build();

        // 3. 이미지 업로드 및 ItemImage 엔티티 생성
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String imageUrl = s3Service.uploadFile("item", file);

                ItemImage itemImage = ItemImage.builder()
                        .item(item)
                        .originalName(file.getOriginalFilename())
                        .imageUrl(imageUrl)
                        .build();

                item.getImages().add(itemImage);
            }
        }

        // 4. Item 저장 및 ResponseDto 반환
        Item savedItem = itemRepository.save(item);
        return ItemCreateResDto.toDto(savedItem);
    }

    // 전체 상품 조회
    @Transactional
    public List<ItemListResDto> getAllItems() {
        return itemRepository.findByDelYn("N").stream()
                .map(ItemListResDto::toDto)
                .collect(Collectors.toList());
    }

    // 상품 상세 조회
    @Transactional
    public ItemResDto getItem(int itemNo) {
        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
        return ItemResDto.toDto(item);
    }


    // 상품 수정
    @Transactional
    public ItemUpdateResDto updateItem(int itemNo, ItemUpdateReqDto reqDto, List<MultipartFile> files) {
        // 1. 기존 상품 조회
        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        // 2. 새 이미지 업로드 및 처리
        List<ItemImage> updatedImages = new ArrayList<>(item.getImages()); // 기존 이미지 유지
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String imageUrl = s3Service.uploadFile("item", file);

                ItemImage itemImage = ItemImage.builder()
                        .item(item)
                        .originalName(file.getOriginalFilename())
                        .imageUrl(imageUrl)
                        .build();

                updatedImages.add(itemImage);
            }
        }

        // 3. 상품 정보 업데이트
        Item updatedItem = Item.builder()
                .itemNo(itemNo)
                .categoryNo(itemCategoryService.getCategory(reqDto.getCategoryNo()))
                .images(updatedImages)
                .companyNo(reqDto.getCompanyNo())
                .name(reqDto.getName())
                .price(reqDto.getPrice())
                .salePrice(reqDto.getSalePrice())
                .expiredAt(reqDto.getExpiredAt())
                .description(reqDto.getDescription())
                .stock(reqDto.getStock())
                .build();

        updatedItem.setCreatedAt(item.getCreatedAt());
        String currentDate = new SimpleDateFormat("yyyyMMdd HHmmss").format(new Date());
        updatedItem.setUpdatedAt(currentDate);

        // 4. 저장 및 응답 반환
        Item savedItem = itemRepository.save(updatedItem);
        return ItemUpdateResDto.toDto(savedItem);
    }


    // 상품 삭제
    @Transactional
    public void deleteItem(int itemNo) {
        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
        item.delete();
        itemRepository.save(item);
    }
}