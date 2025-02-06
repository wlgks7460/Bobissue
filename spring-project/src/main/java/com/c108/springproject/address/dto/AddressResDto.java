package com.c108.springproject.address.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResDto {

    private int addressNo;
    private int userNo;
}
