package com.c108.springproject.order.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigInteger;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderUpdateReqDto {
    private Long orderNo;          // 수정할 주문 번호
    private String requests;      // 배송 요청사항 변경
    private int orderCategoryNo; // 주문 상태 변경
    private int delCategoryNo;   // 배송 상태 변경
}
