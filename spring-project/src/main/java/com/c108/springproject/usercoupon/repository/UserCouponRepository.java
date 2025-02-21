package com.c108.springproject.usercoupon.repository;

import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.usercoupon.domain.UserCoupon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserCouponRepository extends JpaRepository<UserCoupon, Long> {
    Optional<UserCoupon> findByUserCouponNo(Long user_coupon_no);
    Optional<UserCoupon> findByCouponNoAndUserNo(Coupon coupon, User user);
    List<UserCoupon> findByCouponNo(Coupon coupon);
    List<UserCoupon> findByUserNo(User user);
}
