package com.c108.springproject.item.dto.response;

import com.c108.springproject.item.domain.ItemLike;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@Builder
@Data
@NoArgsConstructor
public class ItemLikeResDto {
    private int itemNo;
    private String itemName;
    private int price;
    private int salePrice;
    private String mainImageUrl;
    private String createdAt;

    public static ItemLikeResDto toDto(ItemLike itemLike) {
        String mainImageUrl = null;
        if (!itemLike.getItem().getImages().isEmpty()) {
            mainImageUrl = itemLike.getItem().getImages().get(0).getImageUrl();
        }

        return ItemLikeResDto.builder()
                .itemNo(itemLike.getItem().getItemNo())
                .itemName(itemLike.getItem().getName())
                .price(itemLike.getItem().getPrice())
                .salePrice(itemLike.getItem().getSalePrice())
                .mainImageUrl(mainImageUrl)
                .createdAt(itemLike.getCreatedAt())
                .build();
    }
}
