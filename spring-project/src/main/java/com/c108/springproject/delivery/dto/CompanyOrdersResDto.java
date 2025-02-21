package com.c108.springproject.delivery.dto;

import com.c108.springproject.order.domain.OrderDetail;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyOrdersResDto {
    private long orderNo;
    private UserInfoDto userInfo;
    private HashMap<Integer, Integer> items;

    public static CompanyOrdersResDto toDto(OrderDetail orderDetail, UserInfoDto userInfo) {
        HashMap<Integer, Integer> itemsMap = new HashMap<>();
        itemsMap.put(orderDetail.getItem().getItemNo(), orderDetail.getCount());

        return CompanyOrdersResDto.builder()
                .userInfo(userInfo)
                .orderNo(orderDetail.getOrder().getOrderNo())
                .items(itemsMap)
                .build();
    }
}
