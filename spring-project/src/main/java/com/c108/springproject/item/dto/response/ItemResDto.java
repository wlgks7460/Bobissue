package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.seller.domain.Company;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemResDto {
    private int itemNo;
    private ItemCategoryResDto category;
    private List<ImageDto> images;
    private Company companyNo;
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

    public static ItemResDto toDto(Item item) {
        return ItemResDto.builder()
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
