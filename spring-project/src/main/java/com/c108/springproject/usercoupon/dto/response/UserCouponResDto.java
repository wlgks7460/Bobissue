package com.c108.springproject.usercoupon.dto.response;

import com.c108.springproject.usercoupon.domain.UserCoupon;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserCouponResDto {

    private Long userCouponNo;
    private int userNo;
    private int couponNo;
    private String status;
    private String expiredAt;
    private String createAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;
    private String delYN;

    public static UserCouponResDto toDto(UserCoupon userCoupon){
        return UserCouponResDto.builder()
                .userCouponNo(userCoupon.getUserCouponNo())
                .userNo(userCoupon.getUserNo().getUserNo())
                .couponNo(userCoupon.getCouponNo().getCouponNo())
                .status(userCoupon.getStatus())
                .expiredAt(userCoupon.getExpiredAt())
                .createAt(userCoupon.getCreatedAt())
                .createdUser(userCoupon.getCreatedUser())
                .updatedAt(userCoupon.getUpdatedAt())
                .updatedUser(userCoupon.getUpdatedUser())
                .delYN(userCoupon.getDelYn())
                .build();
    }
}
