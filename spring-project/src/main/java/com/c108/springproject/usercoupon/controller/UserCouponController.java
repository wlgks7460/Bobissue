package com.c108.springproject.usercoupon.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.usercoupon.domain.UserCoupon;
import com.c108.springproject.usercoupon.dto.response.UserCouponResDto;
import com.c108.springproject.usercoupon.service.UserCouponService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupon")
@CrossOrigin(origins = "http://localhost:5173")
public class UserCouponController {

    private final UserCouponService userCouponService;

    public UserCouponController(UserCouponService userCouponService){
        this.userCouponService = userCouponService;
    }

    @PostMapping("/{coupon_no}/userCoupon")
    public ResponseDto createUserCoupon(@PathVariable int coupon_no){
        UserCoupon userCoupon = userCouponService.createUserCoupon(coupon_no);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_USER_COUPON, new DefaultResponse<Long>(userCoupon.getUserCouponNo()));
    }

    //해당 쿠폰을 받은 사람 조회
    @GetMapping("/{coupon_no}/userCoupon")
    public ResponseDto findUserCouponByCouponNo(@PathVariable int coupon_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_COUPON_BY_NO, new DefaultResponse.ListResponse<UserCouponResDto>(userCouponService.findUserCouponByCouponNo(coupon_no)));
    }

    //사용자 별 받은 쿠폰 조회
    @GetMapping("/userCoupon")
    public ResponseDto findMyUserCoupon(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_MY_COUPON, new DefaultResponse.ListResponse<UserCouponResDto>(userCouponService.findMyUserCoupon()));
    }

    //쿠폰 사용
    @PutMapping("/userCoupon/{user_coupon_no}/use")
    public ResponseDto useUserCoupon(@PathVariable Long user_coupon_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_USE_COUPON, new DefaultResponse<Long>(userCouponService.useCoupon(user_coupon_no)));
    }


}
