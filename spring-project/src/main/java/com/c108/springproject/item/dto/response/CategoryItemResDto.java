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
public class CategoryItemResDto {
    private int itemNo;
    private String name;
    private String description;
    private int price;
    private int salePrice;
    private int stock;
    private String expiredAt;
    private List<ImageDto> images;
    private CompanyListResDto company;

    public static CategoryItemResDto toDto(Item item) {
        return CategoryItemResDto.builder()
                .itemNo(item.getItemNo())
                .name(item.getName())
                .description(item.getDescription())
                .price(item.getPrice())
                .salePrice(item.getSalePrice())
                .expiredAt(item.getExpiredAt())
                .images(item.getImages().stream()
                        .map(ImageDto::toDto)
                        .collect(Collectors.toList()))
                .stock(item.getStock())
                .company(CompanyListResDto.builder()
                        .companyNo(item.getCompany().getCompanyNo())
                        .name(item.getCompany().getName())
                        .build())
                .build();
    }
}
