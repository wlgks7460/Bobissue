package com.c108.springproject.item.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.s3.S3Service;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.domain.ItemImage;
import com.c108.springproject.item.domain.ItemLike;
import com.c108.springproject.item.dto.request.ItemCreateReqDto;
import com.c108.springproject.item.dto.request.ItemUpdateReqDto;
import com.c108.springproject.item.dto.response.*;
import com.c108.springproject.item.repository.ItemCategoryRepository;
import com.c108.springproject.item.repository.ItemLikeRepository;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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
    private final ItemCategoryRepository itemCategoryRepository;
    private final S3Service s3Service;
    private final SellerRepository sellerRepository;
    private final ItemLikeRepository itemLikeRepository;
    private final UserRepository userRepository;


    public ItemService(ItemRepository itemRepository, ItemCategoryService itemCategoryService, ItemCategoryRepository itemCategoryRepository, S3Service s3Service, SellerRepository sellerRepository, ItemLikeRepository itemLikeRepository, UserRepository userRepository) {

        this.itemRepository = itemRepository;
        this.itemCategoryService = itemCategoryService;
        this.itemCategoryRepository = itemCategoryRepository;
        this.s3Service = s3Service;
        this.sellerRepository = sellerRepository;
        this.itemLikeRepository = itemLikeRepository;
        this.userRepository = userRepository;
    }

    // 상품 생성
    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public ItemCreateResDto createItem(ItemCreateReqDto reqDto, List<MultipartFile> files) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Company company;
        Seller seller = sellerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        company = seller.getCompany();

        // 판매 권한 체크
        String aprovalStatus = seller.getApprovalStatus();
        if (aprovalStatus.equals("N")) {
            throw new BobIssueException(ResponseCode.UNAUTHORIZED_SELLER_ACCESS);
        }

        // 1. 카테고리 존재 확인 및 가져오기
        ItemCategory category = itemCategoryRepository.findById(reqDto.getCategoryNo())
                .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));

        // 2. Item 엔티티 생성
        Item item = Item.builder()
                .categoryNo(category)
                .company(company)
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
        // 어드민이면 삭제된 것까지 조회
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("ADMIN"));
        if (isAdmin) {
            return itemRepository.findAll().stream()
                    .map(ItemListResDto::toDto)
                    .collect(Collectors.toList());
        }

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
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public ItemUpdateResDto updateItem(int itemNo, ItemUpdateReqDto reqDto, List<MultipartFile> files) {

        // 회사 정보 가져오는 로직
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Company company;
        Seller seller = sellerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        company = seller.getCompany();

        String aprovalStatus = seller.getApprovalStatus();
        if (aprovalStatus.equals("N")) {
            throw new BobIssueException(ResponseCode.UNAUTHORIZED_SELLER_ACCESS);
        }

        // 1. 기존 상품 조회
        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        Company itemCompany = item.getCompany();

        if (!company.equals(itemCompany)) {
            throw new BobIssueException(ResponseCode.UNAUTHORIZED_COMPANY_ACCESS);
        }

        List<ItemImage> updatedImages = new ArrayList<>();

        // 유지할 이미지 처리
        if (reqDto.getKeepImageIds() != null && !reqDto.getKeepImageIds().isEmpty()) {
            updatedImages.addAll(item.getImages().stream()
                    .filter(img -> reqDto.getKeepImageIds().contains(img.getImageNo()))
                    .collect(Collectors.toList()));
        }

        // 삭제할 이미지 처리
        List<String> deleteUrls = item.getImages().stream()
                .filter(img -> reqDto.getKeepImageIds() == null ||
                        !reqDto.getKeepImageIds().contains(img.getImageNo()))
                .map(ItemImage::getImageUrl)
                .collect(Collectors.toList());

        if (!deleteUrls.isEmpty()) {
            s3Service.deleteFiles(deleteUrls);
        }

        // 2-3. 새 이미지 업로드 및 처리
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

        ItemCategory category = itemCategoryRepository.findById(reqDto.getCategoryNo())
                .orElseThrow(() -> new BobIssueException(ResponseCode.CATEGORY_NOT_FOUND));


        // 3. 상품 정보 업데이트
        Item updatedItem = Item.builder()
                .itemNo(itemNo)
                .categoryNo(category)
                .images(updatedImages)
                .company(company)
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
    @PreAuthorize("hasAnyAuthority('SELLER', 'ADMIN')")
    public void deleteItem(int itemNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("ADMIN"));

        // 어드민이 아닐 경우 판매자 정보 확인
        if (!isAdmin) {
            Seller seller = sellerRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

            String aprovalStatus = seller.getApprovalStatus();

            if (aprovalStatus.equals("N")) {
                throw new BobIssueException(ResponseCode.UNAUTHORIZED_SELLER_ACCESS);
            }
        }

        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        // 상품 삭제시 이미지도 삭제
        List<String> deleteUrls = item.getImages().stream()
                .map(ItemImage::getImageUrl)
                .collect(Collectors.toList());

        if (!deleteUrls.isEmpty()) {
            s3Service.deleteFiles(deleteUrls);
        }

        item.getImages().clear();

        item.delete();
        itemRepository.save(item);
    }


    // 상품 찜 Create Delete
    
    // 찜
    @Transactional
//    @PreAuthorize("hasAnyAuthority('USER')")
    public void addLike(int itemNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // 유저가 아닌 경우 예외 처리
        boolean isUser = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("USER"));

        if (!isUser) {
            throw new BobIssueException(ResponseCode.NOT_USER);
        }
        
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));

        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        if (itemLikeRepository.existsByUserAndItem(user, item)) {
            throw new BobIssueException(ResponseCode.ALREADY_LIKED_ITEM);
        }

        ItemLike itemLike = ItemLike.builder()
                .user(user)
                .item(item)
                .createdAt(new SimpleDateFormat("yyyyMMdd HHmmss").format(new Date()))
                .build();

        itemLikeRepository.save(itemLike);
    }
    
    // 찜 취소
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public void removeLike(int itemNo) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));

        Item item = itemRepository.findById(itemNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

        itemLikeRepository.findByUserAndItem(user, item)
                .ifPresent(itemLikeRepository::delete);
    }

    // 찜 목록 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('USER')")
    public List<ItemListResDto> getLikedItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));

        return itemLikeRepository.findByUser(user).stream()
                .map(like -> ItemListResDto.toDto(like.getItem()))
                .collect(Collectors.toList());
    }


//    public List<ItemSearchListResDto> searchItems(String search) {
//        List<Item> items= itemRepository.searchItems(search);
//
//        return items.stream().map(ItemSearchListResDto::toDto).collect(Collectors.toList());
//    }

}