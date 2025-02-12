package com.c108.springproject.order.dto.response;

import com.c108.springproject.order.domain.Order;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateResDto {
    private Long orderNo;
    private int userNo;
    private int addressNo;
    private Long userCouponNo;
    private String payment;
    private int totalPrice;
    private String requests;
    private String orderStatus;
    private String deliveryStatus;
    private String createdAt;
    private List<OrderItemResDto> orderItems;

    public static OrderUpdateResDto toDto(Order order, String orderStatus, String deliveryStatus) {
        return OrderUpdateResDto.builder()
                .orderNo(order.getOrderNo())
                .userNo(order.getUser().getUserNo())
                .addressNo(order.getAddressNo())
                .userCouponNo(order.getUserCouponNo())
                .payment(order.getPayment())
                .totalPrice(order.getTotalPrice())
                .requests(order.getRequests())
                .orderStatus(orderStatus)
                .deliveryStatus(deliveryStatus)
                .createdAt(order.getCreatedAt())
                .orderItems(order.getOrderDetails().stream()
                        .map(OrderItemResDto::toDto)
                        .collect(Collectors.toList()))
                .build();
    }
}