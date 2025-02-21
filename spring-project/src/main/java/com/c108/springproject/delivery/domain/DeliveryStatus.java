package com.c108.springproject.delivery.domain;

public enum DeliveryStatus {
    ORDER_RECEIVED,  // 주문 확인중
    PREPARING,       // 상품 준비중
    IN_TRANSIT,      // 배송 출발
    DELIVERED        // 배송 완료
}
