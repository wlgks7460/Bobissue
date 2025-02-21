package com.c108.springproject.admin.dto;

import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import lombok.*;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerApprovalListDto {
    private int companyNo;
    private String companyName;
    private String license;
    private String status;
    private String bank;
    private String bankAccount;
    private SellerStatistics statistics;  // 통계 정보 추가
    private List<SellerApprovalDto> sellers;

    @Getter
    @NoArgsConstructor
    public static class SellerStatistics {
        private int totalCount;         // 총 판매자 수
        private int approvedCount;      // 승인된 판매자 수
        private int pendingCount;       // 미승인 판매자 수
    }

    public static SellerApprovalListDto toDto(Company company, List<Seller> sellers) {
        SellerApprovalListDto dto = new SellerApprovalListDto();
        dto.companyNo = company.getCompanyNo();
        dto.companyName = company.getName();
        dto.license = company.getLicense();
        dto.status = company.getStatus();
        dto.bank = company.getBank();
        dto.bankAccount = company.getBankAccount();
        dto.sellers = sellers.stream()
                .map(SellerApprovalDto::toDto)
                .collect(Collectors.toList());

        // 통계 정보 계산
        SellerStatistics stats = new SellerStatistics();
        stats.totalCount = sellers.size();
        stats.approvedCount = (int) sellers.stream()
                .filter(seller -> "Y".equals(seller.getApprovalStatus()))
                .count();
        stats.pendingCount = stats.totalCount - stats.approvedCount;

        dto.statistics = stats;

        return dto;
    }

}
