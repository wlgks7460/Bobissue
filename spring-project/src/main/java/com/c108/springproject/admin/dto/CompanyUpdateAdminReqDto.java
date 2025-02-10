package com.c108.springproject.admin.dto;

import com.c108.springproject.seller.domain.Company;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyUpdateAdminReqDto {
    private String name;

    private String license;

    private String bank;

    private String bankAccount;

    private String status;

    public static CompanyUpdateAdminReqDto toDto(Company company) {
        return CompanyUpdateAdminReqDto.builder()
                .name(company.getName())
                .license(company.getLicense())
                .bank(company.getBank())
                .bankAccount(company.getBankAccount())
                .status(company.getStatus())
                .build();
    }
}
