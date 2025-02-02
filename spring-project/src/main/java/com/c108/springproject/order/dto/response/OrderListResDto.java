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
    private String orderStatus;
    private String deliveryStatus;
    private String createdAt;

    public static OrderListResDto toDto(Order order, String orderStatus, String deliveryStatus) {
        return OrderListResDto.builder()
                .orderNo(order.getOrderNo())
                .userNo(order.getUserNo())
                .payment(order.getPayment())
                .totalPrice(order.getTotalPrice())
                .orderStatus(orderStatus)
                .deliveryStatus(deliveryStatus)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
