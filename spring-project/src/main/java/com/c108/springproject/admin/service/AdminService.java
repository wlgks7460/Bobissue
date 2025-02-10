package com.c108.springproject.admin.service;

import com.c108.springproject.admin.dto.AdminResDto;
import com.c108.springproject.admin.dto.CompanyUpdateAdminReqDto;
import com.c108.springproject.admin.repository.AdminRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.request.CompanyUpdateReqDto;
import com.c108.springproject.seller.dto.response.CompanyListResDto;
import com.c108.springproject.seller.dto.response.CompanyResDto;
import com.c108.springproject.seller.dto.response.SellerResDto;
import com.c108.springproject.seller.repository.CompanyRepository;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final CompanyRepository companyRepository;

    public AdminService(AdminRepository adminRepository, UserRepository userRepository, SellerRepository sellerRepository, CompanyRepository companyRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    public List<AdminResDto> findAdminList() {
        return adminRepository.findAll().stream()
                .map(AdminResDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public String changeUserStatus(int userNo) {
        userRepository.changeUserStatus(userNo);
        return userRepository.findUserStatus(userNo);
    }

    @Transactional
    public String changeSellerStatus(int sellerNo) {
        sellerRepository.changeSellerStatus(sellerNo);
        return sellerRepository.findSellerStatus(sellerNo);
    }

    // 회사 삭제
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public void deleteCompany(int companyNo) {
        Company company = companyRepository.findByCompanyNo(companyNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.COMPANY_NOT_FOUND));
        company.delete();
    }

    // 회사 수정
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public CompanyResDto updateCompany(int companyNo, CompanyUpdateAdminReqDto companyUpdateAdminReqDto) {
        Company company = companyRepository.findById(companyNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.COMPANY_NOT_FOUND));

        company.updateCompanyByAdmin(companyUpdateAdminReqDto);

        List<Seller> sellers = sellerRepository.findByCompanyCompanyNo(companyNo);
        List<SellerResDto> sellerResDtos = sellers.stream()
                .map(SellerResDto::toDto)
                .collect(Collectors.toList());
        return CompanyResDto.toDto(company, sellerResDtos);
    }


    // 회사 정보 전체 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<CompanyListResDto> getAllCompany() {
        return companyRepository.findAll().stream()
                .map(CompanyListResDto::toDto)
                .collect(Collectors.toList());
    }

    // 회사 정보 상세 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public CompanyResDto getCompany(int companyNo) {
        List<Seller> sellers = sellerRepository.findByCompanyCompanyNo(companyNo);

        List<SellerResDto> sellerResDtos = sellers.stream()
                .map(SellerResDto::toDto)
                .collect(Collectors.toList());

        Company company = companyRepository.findById(companyNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.COMPANY_NOT_FOUND));
        return CompanyResDto.toDto(company, sellerResDtos);
    }
}
