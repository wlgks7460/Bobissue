package com.c108.springproject.seller.dto.response;

import com.c108.springproject.seller.domain.Seller;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 회사 조회 시 회사 안에 담을 판매자 정보
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SellerResDto {
    private int sellerNo;
    private String name;
    private String callNumber;
    private String email;
    private String status;
    private String approvalStatus;

    public static SellerResDto toDto(Seller seller) {
        return SellerResDto.builder()
                .sellerNo(seller.getSellerNo())
                .name(seller.getName())
                .callNumber(seller.getCallNumber())
                .email(seller.getEmail())
                .status(seller.getStatus())
                .approvalStatus(seller.getApprovalStatus())
                .build();
    }
}
