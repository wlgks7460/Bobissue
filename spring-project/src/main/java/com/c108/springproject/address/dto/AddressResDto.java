package com.c108.springproject.address.dto;

import com.c108.springproject.address.domain.Address;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResDto {

    private int addressNo;
    private int userNo;
    private String postalCode;
    private String address;
    private String addressDetail;

    public static AddressResDto toDto(Address address) {
        AddressResDto addressResDto = AddressResDto.builder()
                .addressNo(address.getAddressNo())
                .userNo(address.getUserNo())
                .postalCode(address.getPostalCode())
                .address(address.getAddress())
                .addressDetail(address.getAddressDetail())
                .build();

        return addressResDto;
    }
}
