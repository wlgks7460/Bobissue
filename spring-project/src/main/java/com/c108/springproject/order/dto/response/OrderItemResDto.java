package com.c108.springproject.order.dto.response;

import com.c108.springproject.order.domain.OrderDetail;
import com.c108.springproject.order.dto.request.OrderItemReqDto;
import lombok.*;

import java.math.BigInteger;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResDto {
    private int itemNo;      // 상품 번호
    private String itemName; // 상품명
    private int count;       // 주문 수량
    private int price;       // 상품 가격 * 수량

    // OrderDetail 엔티티를 DTO로 변환하는 정적 메서드
    public static OrderItemResDto of(OrderDetail detail) {
        return OrderItemResDto.builder()
                .itemNo(detail.getItem().getItemNo())
                .itemName(detail.getItem().getName())
                .count(detail.getCount())
                .price(detail.getPrice())
                .build();
    }
}
