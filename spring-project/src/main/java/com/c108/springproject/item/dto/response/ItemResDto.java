package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.dto.response.CompanyListResDto;
import com.fasterxml.jackson.annotation.JsonInclude;
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
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemResDto {
    private int itemNo;
    private ItemCategoryListResDto category;
    private List<ImageDto> images;
    private CompanyListResDto company;
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

    public static ItemResDto toDto(Item item) {
        return ItemResDto.builder()
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
                .company(CompanyListResDto.builder()  // Company 엔티티 대신 DTO로 변환
                        .companyNo(item.getCompany().getCompanyNo())
                        .name(item.getCompany().getName())
                        .build())
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
//                .delYn(item.getDelYn())
                .build();
    }
}
