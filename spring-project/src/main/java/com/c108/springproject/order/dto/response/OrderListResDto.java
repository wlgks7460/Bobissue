package com.c108.springproject.order.dto.response;

import com.c108.springproject.order.domain.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderListResDto {
    private Long orderNo;
    private int userNo;
    private String payment;
    private int totalPrice;
    private int orderStatus;
    private int deliveryStatus;
    private String createdAt;

    public static OrderListResDto toDto(Order order) {
        return OrderListResDto.builder()
                .orderNo(order.getOrderNo())
                .userNo(order.getUser().getUserNo())
                .payment(order.getPayment())
                .totalPrice(order.getTotalPrice())
                .orderStatus(order.getOrderCategoryNo())
                .deliveryStatus(order.getDelCategoryNo())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
