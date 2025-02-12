package com.c108.springproject.seller.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.request.CompanyReqDto;
import com.c108.springproject.seller.dto.request.CompanyUpdateReqDto;
import com.c108.springproject.seller.dto.response.CompanyListResDto;
import com.c108.springproject.seller.dto.response.CompanyResDto;
import com.c108.springproject.seller.dto.response.SellerResDto;
import com.c108.springproject.seller.repository.CompanyRepository;
import com.c108.springproject.seller.repository.SellerRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {
    private final CompanyRepository companyRepository;
    private final SellerRepository sellerRepository;

    public CompanyService(CompanyRepository companyRepository, SellerRepository sellerRepository) {
        this.companyRepository = companyRepository;
        this.sellerRepository = sellerRepository;
    }


    // 회사 등록
    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public CompanyListResDto createCompany(CompanyReqDto companyReqDto) {
        
        // 초기 판매자 회사 번호 자동 등록
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Seller seller = sellerRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        
        try {
            Company company = Company.builder()
                    .name(companyReqDto.getName())
                    .license(companyReqDto.getLicense())
                    .status("Y")
                    .bank(companyReqDto.getBank())
                    .bankAccount(companyReqDto.getBankAccount())
                    .build();
            companyRepository.save(company);

            seller.updateCompany(company);
            sellerRepository.save(seller);

            return CompanyListResDto.toDto(company);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_COMPANY);
        }

    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public CompanyResDto updateCompany(int companyNo, CompanyUpdateReqDto companyUpdateReqDto) {
        Company company = companyRepository.findById(companyNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.COMPANY_NOT_FOUND));
        company.updateCompany(companyUpdateReqDto);

        List<Seller> sellers = sellerRepository.findByCompanyCompanyNo(companyNo);
        List<SellerResDto> sellerResDtos = sellers.stream()
                .map(SellerResDto::toDto)
                .collect(Collectors.toList());
        return CompanyResDto.toDto(company, sellerResDtos);
    }

    // 회사 정보 상세 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public CompanyResDto getCompany() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Seller seller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        int companyNo = seller.getCompany().getCompanyNo();

        List<Seller> sellers = sellerRepository.findByCompanyCompanyNo(companyNo);

        List<SellerResDto> sellerResDtos = sellers.stream()
                .map(SellerResDto::toDto)
                .collect(Collectors.toList());

        Company company = companyRepository.findById(companyNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.COMPANY_NOT_FOUND));
        return CompanyResDto.toDto(company, sellerResDtos);
    }


}
