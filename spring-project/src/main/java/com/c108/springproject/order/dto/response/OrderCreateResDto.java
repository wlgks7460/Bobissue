package com.c108.springproject.order.dto.response;

import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.OrderDetail;
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
public class OrderCreateResDto {
    private Long orderNo;             // 생성된 주문 번호
    private int userNo;              // 주문자 번호
    private int couponNo; // 사용된 쿠폰 번호
    private int paymentPrice;          // 총 주문 금액
    private String payment;          // 결제 방식
    private String requests;         // 배송 요청사항
    private List<OrderItemResDto> items;  // 주문 상품 목록

     public static OrderCreateResDto toDto(Order order) {
        return OrderCreateResDto.builder()
                .orderNo(order.getOrderNo())
                .userNo(order.getUser().getUserNo())
                .couponNo(order.getCoupon().getCouponNo())
                .paymentPrice(order.getPaymentPrice())
                .payment(order.getPayment())
                .requests(order.getRequests())
                .items(order.getOrderDetails().stream()
                        .map(OrderItemResDto::toDto)
                        .collect(Collectors.toList()))
                .build();
    }
}
