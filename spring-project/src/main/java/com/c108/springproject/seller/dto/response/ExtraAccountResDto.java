package com.c108.springproject.seller.dto.response;

import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ExtraAccountResDto {
    private int sellerNo;
    private String email;
    private String password;
    private String callNumber;
    private String name;
    private CompanyListResDto company;

    public static ExtraAccountResDto toDto(Seller seller) {
        return ExtraAccountResDto.builder()
                .sellerNo(seller.getSellerNo())
                .email(seller.getEmail())
                .password(seller.getPassword())
                .callNumber(seller.getCallNumber())
                .name(seller.getName())
                .company(CompanyListResDto.toDto(seller.getCompany()))
                .build();
    }
}
