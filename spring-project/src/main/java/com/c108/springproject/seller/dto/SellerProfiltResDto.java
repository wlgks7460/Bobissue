package com.c108.springproject.seller.dto;

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
public class SellerProfiltResDto {
    private int sellerNo;
    private String name;
    private String email;
    private Company companyNo;
    private String callNumber;

    public static SellerProfiltResDto toDto(Seller seller) {
        return SellerProfiltResDto.builder()
                .sellerNo(seller.getSellerNo())
                .name(seller.getName())
                .email(seller.getEmail())
                .callNumber(seller.getCallNumber())
                .companyNo(seller.getCompanyNo())
                .build();
    }
}
