package com.c108.springproject.seller.dto.response;

import com.c108.springproject.seller.domain.Company;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyListResDto {
    private int companyNo;

    private String name;

    private String license;

    private String status;

    private String bank;

    private String bankAccount;

    public static CompanyListResDto toDto(Company company) {
        return CompanyListResDto.builder()
                .companyNo(company.getCompanyNo())
                .name(company.getName())
                .license(company.getLicense())
                .status(company.getStatus())
                .bank(company.getBank())
                .bankAccount(company.getBankAccount())
                .build();
    }
}
