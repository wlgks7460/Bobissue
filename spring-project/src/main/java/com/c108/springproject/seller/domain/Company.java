package com.c108.springproject.seller.domain;

import com.c108.springproject.admin.dto.CompanyUpdateAdminReqDto;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.seller.dto.request.CompanyUpdateReqDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int companyNo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String license;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;

    @Column(nullable = false)
    private String bank;

    @Column(nullable = false)
    private String bankAccount;


    @Builder.Default
    @OneToMany(mappedBy = "company")
    @JsonIgnore
    private List<Seller> sellers = new ArrayList<>();


    public void updateCompany(CompanyUpdateReqDto dto) {
        this.name = dto.getName();
        this.bank = dto.getBank();
        this.bankAccount = dto.getBankAccount();
    }
    public void updateCompanyByAdmin(CompanyUpdateAdminReqDto dto) {
        this.name = dto.getName();
        this.license = dto.getLicense();
        this.bank = dto.getBank();
        this.bankAccount = dto.getBankAccount();
        this.status = dto.getStatus();
    }


}
