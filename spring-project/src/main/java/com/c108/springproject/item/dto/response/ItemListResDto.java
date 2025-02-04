package com.c108.springproject.item.dto.response;


import com.c108.springproject.item.domain.Item;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemListResDto {
    private int itemNo;
    private int categoryNo;
    private List<ImageDto> images;
    private int companyNo;
    private String name;
    private int price;
    private int salePrice;
    private String description;

    public static ItemListResDto toDto(Item item) {
        return ItemListResDto.builder()
                .itemNo(item.getItemNo())
                .categoryNo(item.getCategoryNo().getCategoryNo())
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
