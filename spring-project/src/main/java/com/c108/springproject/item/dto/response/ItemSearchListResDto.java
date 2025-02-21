package com.c108.springproject.item.dto.response;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
import com.c108.springproject.item.domain.ItemImage;
import com.c108.springproject.item.repository.ItemRepository;
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
    private String name;
    private int price;
    private int salePrice;
    private int stock;
    private String images;

    public static ItemSearchListResDto toDto(Item item) {
        String defaultImageUrl = "https://bobissue-dev-storage-ap.s3.ap-northeast-2.amazonaws.com/global/NoImage.png";
        String imageUrl = item.getImages() != null && !item.getImages().isEmpty()
                ? item.getImages().get(0).getImageUrl()
                : defaultImageUrl;

        return ItemSearchListResDto.builder()
                .itemNo(item.getItemNo())
                .name(item.getName())
                .price(item.getPrice())
                .salePrice(item.getSalePrice())
                .images(imageUrl)
                .build();
    }


}
