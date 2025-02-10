package com.c108.springproject.seller.dto.response;


import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyResDto {
    private int companyNo;

    private String name;

    private String license;

    private String status;

    private String bank;

    private String bankAccount;

    private List<SellerResDto> sellers;

    public static CompanyResDto toDto(Company company, List<SellerResDto> sellers) {
        return CompanyResDto.builder()
                .companyNo(company.getCompanyNo())
                .name(company.getName())
                .license(company.getLicense())
                .status(company.getStatus())
                .bank(company.getBank())
                .bankAccount(company.getBankAccount())
                .sellers(sellers)
                .build();
    }

}
