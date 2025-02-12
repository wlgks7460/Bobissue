package com.c108.springproject.item.dto.response;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemCategory;
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
    private String categoryName;
    private String name;
    private int price;
    private int salePrice;
    private ImageDto images;
    private String companyName;

//    public static ItemSearchListResDto toDto(Item item) {
//        return ItemSearchListResDto.builder()
//                .itemNo(item.getItemNo())
//                .name(item.getName())
//                .price( item.getPrice())
//                .salePrice(item.getSalePrice())
//                .categoryName(getCategoryName(item.getCategoryNo()))
//                .company(CompanyListResDto.toDto(item.getCompany()))
//                .images(List.of()) // 이미지 로직은 추후 추가
//                .build();
//    }




//    private static String getCategoryName(int categoryNo) {
//        Item item = itemRepository.findById(categoryNo).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_ITEM_CATEGORY));
//
//        return item.getName();
//    }

}
