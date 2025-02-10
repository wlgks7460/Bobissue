package com.c108.springproject.admin.dto;

import com.c108.springproject.seller.domain.Seller;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 승인 조회 리스트에서 사용할 Dto
@Getter
@NoArgsConstructor
public class SellerApprovalDto {
    private int sellerNo;
    private String name;
    private String email;
    private String callNumber;
    private String status;
    private String approvalStatus;

    public static SellerApprovalDto toDto(Seller seller) {
        SellerApprovalDto info = new SellerApprovalDto();
        info.sellerNo = seller.getSellerNo();
        info.name = seller.getName();
        info.email = seller.getEmail();
        info.callNumber = seller.getCallNumber();
        info.status = seller.getStatus();
        info.approvalStatus = seller.getApprovalStatus();
        return info;
    }
}

