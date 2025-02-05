package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.Item;
import lombok.*;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemUpdateResDto {
    private int itemNo;
    private ItemCategoryResDto category;
    private List<ImageDto> images;
    private int companyNo;
    private String name;
    private int price;
    private int salePrice;
    private String createdAt;
    private int createdUser;
    private String updatedAt;
    private int updatedUser;
    private String expiredAt;
    private String description;
    private int stock;
    private String delYn;

    public static ItemUpdateResDto toDto(Item item) {
        return ItemUpdateResDto.builder()
                .itemNo(item.getItemNo())
                .category(ItemCategoryResDto.builder()
                        .categoryNo(item.getCategoryNo().getCategoryNo())
                        .name(item.getCategoryNo().getName())
                        .createdAt(item.getCategoryNo().getCreatedAt())
                        .updatedAt(item.getCategoryNo().getUpdatedAt())
                        .build())
                .images(item.getImages().stream()
                        .map(image -> ImageDto.toDto(image))
                        .collect(Collectors.toList()))
                .companyNo(item.getCompanyNo())
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