package com.c108.springproject.seller.dto.request;


import com.c108.springproject.seller.domain.Company;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CompanyUpdateReqDto {
    private String name;

    private String bank;

    private String bankAccount;

    public static CompanyUpdateReqDto toDto(Company company) {
        return CompanyUpdateReqDto.builder()
                .name(company.getName())
                .bank(company.getBank())
                .bankAccount(company.getBankAccount())
                .build();
    }
}
