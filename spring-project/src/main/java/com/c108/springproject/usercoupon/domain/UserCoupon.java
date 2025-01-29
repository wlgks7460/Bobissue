package com.c108.springproject.usercoupon.domain;

import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.user.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserCoupon extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long userCouponNo;

    @ManyToOne
    @JoinColumn(name = "user_no", nullable = false)
    private User userNo;

    @ManyToOne
    @JoinColumn(name = "coupon_no", nullable = false)
    private Coupon couponNo;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;

    @Column(nullable = false, length = 15)
    private String expiredAt;

    public void setExpiredAt(int term){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");
        LocalDateTime expiredDateTime = LocalDateTime.now().plusDays(term);
        this.expiredAt = expiredDateTime.format(formatter);
    }

    public void useCoupon(){
        this.status = "Y";
    }

}
