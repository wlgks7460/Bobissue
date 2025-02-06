package com.c108.springproject.seller.dto;

import com.c108.springproject.seller.domain.Seller;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerDto {
    private String name;
    private String callNumber;
    private String email;
    private String status;
    private int companyNo;

    public SellerDto(Seller seller) {
        this.email = seller.getEmail();
        this.status = seller.getStatus();
        this.companyNo = (seller.getCompanyNo() != null) ? seller.getCompanyNo().getCompanyNo() : 0; // 기본값 0
        this.name = seller.getName();
        this.callNumber = seller.getCallNumber();
    }

}
