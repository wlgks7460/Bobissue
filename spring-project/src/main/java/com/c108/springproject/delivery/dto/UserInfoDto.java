package com.c108.springproject.delivery.dto;

import com.c108.springproject.address.domain.Address;
import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {
    private String userName;
    private String userPhoneNumber;
    private Address address;
    private String request;
}
