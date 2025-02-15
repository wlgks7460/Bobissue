package com.c108.springproject.seller.dto.querydsl;

import lombok.*;

@Data
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ItemRankingDto {
    private Integer itemNo;        // 상품 번호
    private String itemName;       // 상품명
    private Long totalSoldCount;   // 총 판매 수량 (Long으로 변경)
    private Long totalSales;       // 총 매출액 (Long으로 변경)
    private Double averageRating;  // 평균 평점

    public ItemRankingDto(Integer itemNo, String itemName, Long totalSoldCount, Long totalSales) {
        this.itemNo = itemNo;
        this.itemName = itemName;
        this.totalSoldCount = totalSoldCount;
        this.totalSales = totalSales;
    }
    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }
}
