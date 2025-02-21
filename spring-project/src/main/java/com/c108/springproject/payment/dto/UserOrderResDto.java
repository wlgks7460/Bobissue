package com.c108.springproject.payment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserOrderResDto {
    private int userNo;
    private int point;
    private int baseAddress;
}
