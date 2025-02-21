package com.c108.springproject.seller.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyReqDto {
    private String name;

    private String license;

//    private String status;

    private String bank;

    private String bankAccount;

}
