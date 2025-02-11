package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.seller.dto.response.CompanyListResDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemSearchListResDto {
    private int itemNo;
    private ItemCategoryListResDto category;
    private List<ImageDto> images;
    private CompanyListResDto company;
    private String name;
    private int price;
    private int salePrice;

    public static ItemSearchListResDto toDto(Item item) {
        return ItemSearchListResDto.builder()
                .itemNo(item.getItemNo())
                .name(item.getName())
                .price((int) item.getPrice())
                .salePrice(item.getSalePrice())
                .category(new ItemCategoryListResDto(item.getCategory().getCategoryNo(), item.getCategory().getName()))
                .company(CompanyListResDto.toDto(item.getCompany()))
                .images(List.of()) // 이미지 로직은 추후 추가
                .build();
    }
}
