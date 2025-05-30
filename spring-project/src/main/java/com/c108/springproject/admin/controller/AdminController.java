package com.c108.springproject.admin.controller;

import com.c108.springproject.admin.dto.AdminResDto;
import com.c108.springproject.admin.dto.CompanyUpdateAdminReqDto;
import com.c108.springproject.admin.dto.SellerApprovalListDto;
import com.c108.springproject.admin.service.AdminService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.seller.dto.response.CompanyListResDto;
import com.c108.springproject.seller.dto.response.CompanyResDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping
    public ResponseDto findAdminList() {
        List<AdminResDto> adminList = adminService.findAdminList();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_ADMIN, new DefaultResponse<List<AdminResDto>>(adminList));
    }

    @PutMapping("/{userNo}/user-status")
    public ResponseDto activateUserStatus(@PathVariable int userNo) {
        String status = adminService.changeUserStatus(userNo);

        if(status.equals("Y")){ //활성화로 변경되었을 경우
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_USER_STATUS, "ACTIVE");
        }else{ //비활성화로 변경되었을 경우
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_USER_STATUS, "DEACTIVE");
        }
    }

    @PutMapping("/{sellerNo}/seller-status")
    public ResponseDto activateSellerStatus(@PathVariable int sellerNo) {
        String status = adminService.changeSellerStatus(sellerNo);

        if(status.equals("Y")){
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_SELLER_STATUS, "ACTIVE");
        }else{
            return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_SELLER_STATUS, "DEACTIVE");
        }
    }


    // 전체 회사 조회

    @GetMapping("/company")
    public ResponseDto getAllCompany() {
        List<CompanyListResDto> companyList = adminService.getAllCompany();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_COMPANY, new DefaultResponse<>(companyList));
    }

    // 회사 상세 조회
    @GetMapping("/company/{companyNo}")
    public ResponseDto getCompany(
            @PathVariable int companyNo
    ) {
        CompanyResDto company = adminService.getCompany(companyNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_COMPANY, new DefaultResponse<>(company));
    }

    // 회사 정보 수정(관리자)
    @PutMapping("/company/{companyNo}")
    public ResponseDto updateCompany(
            @PathVariable int companyNo,
            @RequestBody CompanyUpdateAdminReqDto companyUpdateAdminReqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_COMPANY, new DefaultResponse<>(adminService.updateCompany(companyNo, companyUpdateAdminReqDto)));
    }

    // 회사 삭제
    @DeleteMapping("/company/{companyNo}")
    public ResponseDto deleteCompany(
            @PathVariable int companyNo
    ) {
        adminService.deleteCompany(companyNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_COMPANY, new DefaultResponse<>(companyNo));
    }

    @PutMapping("/{sellerNo}/approve")
    public ResponseDto changeSellerApprovalStatus(@PathVariable int sellerNo) {
        String approvalStatus = adminService.changeSellerApprovalStatus(sellerNo);
        return new ResponseDto(HttpStatus.ACCEPTED, ResponseCode.SUCCESS_CHANGE_SELLER_APPROVAL_STATUS, new DefaultResponse<>(approvalStatus));
    }

    @GetMapping("/seller-approvals")
    public ResponseDto getSellerApprovalsByCompany() {
        List<SellerApprovalListDto> approvals = adminService.getSellerApprovalsByCompany();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_SELLER_APPROVALS, new DefaultResponse<>(approvals));
    }

    
    // 통계 관련
    // 총 판매 금액(쇼핑몰)
    @GetMapping("/total-sales")
    public ResponseDto getTotalSales() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_TOTAL_SALES, new DefaultResponse<>(adminService.getTotalSales()));
    }

    // 유저 전체 통계
    @GetMapping("/user-statistics")
    public ResponseDto getUserStatistics() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_USER_STATISTICS, new DefaultResponse<>(adminService.getUserStatistics()));
    }

    // 회사 전체 통계
    @GetMapping("/company-statistics")
    public ResponseDto getCompanyStatistics() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_COMPANY_STATISTICS, new DefaultResponse<>(adminService.getCompanyStatistics()));
    }

    // 판매자 전체 통계
    @GetMapping("/seller-statistics")
    public ResponseDto getSellerStatistics() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_SELLER_STATISTICS, new DefaultResponse<>(adminService.getSellerStatistics()));
    }

    @GetMapping("/statistics/monthly-comparison")
    public ResponseDto getTotalMonthlySalesComparison() {
        return new ResponseDto(HttpStatus.OK,
                ResponseCode.SUCCESS_GET_TOTAL_MONTHLY_COMPARISON,
                new DefaultResponse<>(adminService.getTotalMonthlySalesComparison()));
    }

    @GetMapping("/statistics/category")
    public ResponseDto getTotalCategorySalesStatistics() {
        return new ResponseDto(HttpStatus.OK,
                ResponseCode.SUCCESS_GET_TOTAL_CATEGORY_STATS,
                new DefaultResponse<>(adminService.getTotalCategorySalesStatistics()));
    }

    @GetMapping("/statistics/hourly")
    public ResponseDto getTotalHourlySalesStatistics() {
        return new ResponseDto(HttpStatus.OK,
                ResponseCode.SUCCESS_GET_TOTAL_HOURLY_STATS,
                new DefaultResponse<>(adminService.getTotalHourlySalesStatistics()));
    }

    @GetMapping("/statistics/demographic")
    public ResponseDto getTotalDemographicStats() {
        return new ResponseDto(
                HttpStatus.OK,
                ResponseCode.SUCCESS_GET_DEMOGRAPHIC_STATS,
                new DefaultResponse<>(adminService.getTotalDemographicStats())
        );
    }


}