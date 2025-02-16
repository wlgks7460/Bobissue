package com.c108.springproject.admin.service;

import com.c108.springproject.admin.dto.AdminResDto;
import com.c108.springproject.admin.dto.CompanyUpdateAdminReqDto;
import com.c108.springproject.admin.dto.SellerApprovalListDto;
import com.c108.springproject.admin.dto.querydsl.CompanyStatisticsDto;
import com.c108.springproject.admin.dto.querydsl.SellerStatisticsDto;
import com.c108.springproject.admin.dto.querydsl.UserStatisticsDto;
import com.c108.springproject.admin.repository.AdminQueryRepository;
import com.c108.springproject.admin.repository.AdminRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.querydsl.CategorySalesDto;
import com.c108.springproject.seller.dto.querydsl.HourlySalesDto;
import com.c108.springproject.seller.dto.querydsl.MonthlySalesComparisonDto;
import com.c108.springproject.seller.dto.response.CompanyListResDto;
import com.c108.springproject.seller.dto.response.CompanyResDto;
import com.c108.springproject.seller.dto.response.SellerResDto;
import com.c108.springproject.seller.repository.CompanyRepository;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.domain.User;
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
    private final AdminQueryRepository adminQueryRepository;

    public AdminService(AdminRepository adminRepository, UserRepository userRepository, SellerRepository sellerRepository, CompanyRepository companyRepository, AdminQueryRepository adminQueryRepository) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.sellerRepository = sellerRepository;
        this.companyRepository = companyRepository;
        this.adminQueryRepository = adminQueryRepository;
    }

    // 관리자 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<AdminResDto> findAdminList() {
        try {
            return adminRepository.findAll().stream()
                    .map(AdminResDto::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.ADMIN_NOT_FOUND);
        }
    }

    // 사용자 활성화 상태 변경
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public String changeUserStatus(int userNo) {
        User user =userRepository.findById(userNo).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_USER));
        try {
            return user.setStatus();
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CHANGE_USER_STATUS);
        }
    }

    // 판매자 활성화 상태 변경
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public String changeSellerStatus(int sellerNo) {
        Seller seller = sellerRepository.findById(sellerNo).orElseThrow(()-> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        try {
            return seller.setStatus();
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CHANGE_SELLER_STATUS);
        }
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

        try {
            List<Seller> sellers = sellerRepository.findByCompanyCompanyNo(companyNo);
            List<SellerResDto> sellerResDtos = sellers.stream()
                    .map(SellerResDto::toDto)
                    .collect(Collectors.toList());
            return CompanyResDto.toDto(company, sellerResDtos);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_COMPANY);
        }

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


    // 판매자 계정 판매 권한 부여 및 취소
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public String changeSellerApprovalStatus(int sellerNo) {
        Seller seller = sellerRepository.findById(sellerNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        try {
            // Seller 엔티티의 메서드
            seller.updateApprovalStatus();

            sellerRepository.save(seller);
            return seller.getApprovalStatus();
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_APPROVAL_SELL);
        }
    }
    
    // 승인 상태와 함께 회사별 판매자 조회
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<SellerApprovalListDto> getSellerApprovalsByCompany() {
        List<Company> companies = companyRepository.findAll();

        try {
            return companies.stream()
                    .map(company -> {
                        List<Seller> sellers = sellerRepository.findByCompanyCompanyNo(company.getCompanyNo());
                        return SellerApprovalListDto.toDto(company, sellers);
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_APPROVAL_BY_COMPANY);
        }
    }


    // 총 매출 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public Long getTotalSales() {
        return adminQueryRepository.getTotalSales();
    }

    // 유저 전체 통계
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public UserStatisticsDto getUserStatistics() {
        return adminQueryRepository.getUserStatistics();
    }

    // 회사 전체 통계
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public CompanyStatisticsDto getCompanyStatistics() {
        return adminQueryRepository.getCompanyStatistics();
    }

    // 판매자 전체 통계
    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public SellerStatisticsDto getSellerStatistics() {
        return adminQueryRepository.getSellerStatistics();
    }

    // 전월 대비 실적
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public MonthlySalesComparisonDto getTotalMonthlySalesComparison() {
        return adminQueryRepository.getTotalMonthlySalesComparison();
    }

    // 카테고리 판매 통계
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<CategorySalesDto> getTotalCategorySalesStatistics() {
        return adminQueryRepository.getTotalCategorySalesStatistics();
    }

    // 시간대별 통계
    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<HourlySalesDto> getTotalHourlySalesStatistics() {
        return adminQueryRepository.getTotalHourlySalesStatistics();
    }

}
