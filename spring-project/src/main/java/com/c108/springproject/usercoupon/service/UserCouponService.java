package com.c108.springproject.usercoupon.service;

import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.coupon.dto.response.CouponResDto;
import com.c108.springproject.coupon.repository.CouponRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import com.c108.springproject.usercoupon.domain.UserCoupon;
import com.c108.springproject.usercoupon.dto.response.UserCouponResDto;
import com.c108.springproject.usercoupon.repository.UserCouponRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserCouponService {

    private final UserCouponRepository userCouponRepository;
    private final CouponRepository couponRepository;
    private final UserRepository userRepository;

    public UserCouponService(UserCouponRepository userCouponRepository,
                             CouponRepository couponRepository,
                             UserRepository userRepository){
        this.userCouponRepository = userCouponRepository;
        this.couponRepository = couponRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public UserCoupon createUserCoupon(int coupon_no){
        //로그인 되면 Auth에서 유저 정보 가져오기
        Coupon coupon = couponRepository.findByCouponNo(coupon_no).orElseThrow(() -> new BobIssueException(ResponseCode.COUPON_NOT_FOUND));
        User user = userRepository.findById(252).orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));
        if(userCouponRepository.findByCouponNoAndUserNo(coupon, user).isPresent()){
            throw new BobIssueException(ResponseCode.ALREADY_CREATE_USER_COUPON);
        }
        if(coupon.getDelYn().equals("N")){
            try{
                UserCoupon new_usercoupon = UserCoupon.builder()
                        .userNo(user)
                        .couponNo(coupon)
                        .status("N")
                        .build();
                new_usercoupon.setExpiredAt(coupon.getTerm());
                return userCouponRepository.save(new_usercoupon);
            }catch (BobIssueException e){
                throw new BobIssueException(ResponseCode.FAILED_CREATE_USER_COUPON);
            }
        }else{
            throw new BobIssueException(ResponseCode.FAILED_CREATE_USER_COUPON);
        }
    }


    @Transactional
    public List<UserCouponResDto> findUserCouponByCouponNo(int coupon_no){
        Coupon coupon = couponRepository.findByCouponNo(coupon_no).orElseThrow(()-> new BobIssueException(ResponseCode.COUPON_NOT_FOUND));
        try {
            List<UserCoupon> userCoupons = userCouponRepository.findByCouponNo(coupon);
            List<UserCouponResDto> userCouponResDtos = new ArrayList<>();
            for(UserCoupon userCoupon : userCoupons){
                userCouponResDtos.add(UserCouponResDto.toDto(userCoupon));
            }
            return userCouponResDtos;
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.COUPON_NOT_FOUND_BY_NO);
        }
    }

    @Transactional
    public List<UserCouponResDto> findMyUserCoupon(){
        User user = userRepository.findById(252).orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));
        try {
            List<UserCoupon> myCoupons = userCouponRepository.findByUserNo(user);
            List<UserCouponResDto> userCouponResDtos = new ArrayList<>();
            for(UserCoupon userCoupon : myCoupons){
                userCouponResDtos.add(UserCouponResDto.toDto(userCoupon));
            }
            return userCouponResDtos;
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.MY_COUPON_NOT_FOUND);
        }
    }

    @Transactional
    public Long useCoupon(Long user_coupon_no){
        UserCoupon userCoupon = userCouponRepository.findByUserCouponNo(user_coupon_no).orElseThrow(()-> new BobIssueException(ResponseCode.COUPON_NOT_FOUND));
        User user = userRepository.findById(252).orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));
        if(user.getUserNo() != userCoupon.getUserNo().getUserNo()){
            throw new BobIssueException(ResponseCode.MY_COUPON_NOT_FOUND);
        }

        try{
            userCoupon.useCoupon();
            return user_coupon_no;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_USE_COUPON);
        }

    }
}
