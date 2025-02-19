package com.c108.springproject.delivery.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryReqDto {
    String delCompany; // 택배사
    String delNumber; // 송장번호
}
