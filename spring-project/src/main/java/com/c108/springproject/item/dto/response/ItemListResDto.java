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
public class ItemListResDto {
    private int itemNo;
    private ItemCategoryListResDto category;
    private List<ImageDto> images;
    private Company companyNo;
    private String name;
    private int price;
    private int salePrice;
    private String description;

    public static ItemListResDto toDto(Item item) {
        return ItemListResDto.builder()
                .itemNo(item.getItemNo())
                .category(ItemCategoryListResDto.builder()
                        .categoryNo(item.getCategoryNo().getCategoryNo())
                        .name(item.getCategoryNo().getName())
                        .parentNo(item.getCategoryNo().getParent() != null ?
                                item.getCategoryNo().getParent().getCategoryNo() : null)
                        .parentName(item.getCategoryNo().getParent() != null ?
                                item.getCategoryNo().getParent().getName() : null)
                        .build())
                .images(item.getImages().stream()
                        .map(image -> ImageDto.toDto(image))
                        .collect(Collectors.toList()))
                .companyNo(item.getCompanyNo())
                .name(item.getName())
                .price(item.getPrice())
                .salePrice(item.getSalePrice())
                .description(item.getDescription())
                .build();
    }
}
