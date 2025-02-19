package com.c108.springproject.delivery.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryReqDto {
    String courier; // 택배사
    String trackingNumber; // 송장번호
}
