package com.c108.springproject.address.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AddressReqDto {
    private int userNo;
    private String name;
    private String postalCode;
    private String address;
    private String addressDetail;
}
