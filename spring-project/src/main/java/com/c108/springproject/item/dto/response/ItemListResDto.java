package com.c108.springproject.item.dto.response;


import com.c108.springproject.item.domain.Item;
import com.c108.springproject.seller.dto.response.CompanyListResDto;
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
    private CompanyListResDto company;
    private String name;
    private int price;
    private int salePrice;
    private String description;

    public static ItemListResDto toDto(Item item) {
        return ItemListResDto.builder()
                .itemNo(item.getItemNo())
                .category(ItemCategoryListResDto.builder()
                        .categoryNo(item.getCategory().getCategoryNo())
                        .name(item.getCategory().getName())
                        .parentNo(item.getCategory().getParent() != null ?
                                item.getCategory().getParent().getCategoryNo() : null)
                        .parentName(item.getCategory().getParent() != null ?
                                item.getCategory().getParent().getName() : null)
                        .build())
                .images(item.getImages().stream()
                        .map(image -> ImageDto.toDto(image))
                        .collect(Collectors.toList()))
                .company(CompanyListResDto.builder()  // Company 엔티티 대신 DTO로 변환
                        .companyNo(item.getCompany().getCompanyNo())
                        .name(item.getCompany().getName())
                        .build())
                .name(item.getName())
                .price(item.getPrice())
                .salePrice(item.getSalePrice())
                .description(item.getDescription())
                .build();
    }
}
