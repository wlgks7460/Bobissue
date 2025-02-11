package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.seller.domain.Company;
import lombok.*;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemCreateResDto {
    private int itemNo;
    private ItemCategoryResDto category;
    private java.util.List<ImageDto> images;  // ImageNo 대신 List<ImageDto>로 변경
    private Company company;
    private String name;
    private int price;
    private int salePrice;
    private String createdAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;
    private String expiredAt;
    private String description;
    private int stock;
    private String delYn;

    public static ItemCreateResDto toDto(Item item) {  // static 메서드 수정
        return ItemCreateResDto.builder()
                .itemNo(item.getItemNo())
                .category(ItemCategoryResDto.builder()
                        .categoryNo(item.getCategoryNo().getCategoryNo())
                        .name(item.getCategoryNo().getName())
                        .createdAt(item.getCategoryNo().getCreatedAt())
                        .updatedAt(item.getCategoryNo().getUpdatedAt())
                        .build())
                .images(item.getImages().stream()
                        .map(image -> ImageDto.builder()
                                .imageNo(image.getImageNo())
                                .imageUrl(image.getImageUrl())
                                .originalName(image.getOriginalName())
                                .build())
                        .collect(java.util.stream.Collectors.toList()))
                .company(item.getCompany())
                .name(item.getName())
                .price(item.getPrice())
                .salePrice(item.getSalePrice())
                .createdAt(item.getCreatedAt())
                .createdUser(item.getCreatedUser())
                .updatedAt(item.getUpdatedAt())
                .updatedUser(item.getUpdatedUser())
                .expiredAt(item.getExpiredAt())
                .description(item.getDescription())
                .stock(item.getStock())
                .delYn(item.getDelYn())
                .build();
    }
}