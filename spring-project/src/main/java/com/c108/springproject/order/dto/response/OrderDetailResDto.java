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
public class OrderDetailResDto {
    private Long orderNo;
    private int userNo;
    private int addressNo;
    private Integer couponNo;
    private String payment;
    private int totalPrice;
    private String requests;
    private int orderStatus;
    private int deliveryStatus;
    private String createdAt;
    private List<OrderItemResDto> orderItems;

    public static OrderDetailResDto toDto(Order order) {
        return OrderDetailResDto.builder()
                .orderNo(order.getOrderNo())
                .userNo(order.getUser().getUserNo())
                .addressNo(order.getAddress().getAddressNo())
                .couponNo(order.getCoupon() != null ? order.getCoupon().getCouponNo() : null)
                .payment(order.getPayment())
                .totalPrice(order.getTotalPrice())
                .requests(order.getRequests())
                .createdAt(order.getCreatedAt())
                .orderItems(order.getOrderDetails().stream()
                        .map(OrderItemResDto::toDto)
                        .collect(Collectors.toList()))
                .orderStatus(order.getOrderCategoryNo())
                .deliveryStatus(order.getDelCategoryNo())
                .build();
    }

}
