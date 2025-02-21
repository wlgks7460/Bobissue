package com.c108.springproject.address.dto;

import com.c108.springproject.address.domain.Address;
import com.c108.springproject.user.domain.User;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResDto {

    private int addressNo;
    private User user;
    private String postalCode;
    private String address;
    private String addressDetail;
    private String name;

    public static AddressResDto toDto(Address address) {
        AddressResDto addressResDto = AddressResDto.builder()
                .addressNo(address.getAddressNo())
                .user(address.getUser())
                .postalCode(address.getPostalCode())
                .address(address.getAddress())
                .addressDetail(address.getAddressDetail())
                .name(address.getName())
                .build();

        return addressResDto;
    }
}
