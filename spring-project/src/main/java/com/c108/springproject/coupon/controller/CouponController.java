package com.c108.springproject.coupon.controller;

import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.coupon.dto.request.CouponReqDto;
import com.c108.springproject.coupon.dto.response.CouponResDto;
import com.c108.springproject.coupon.service.CouponService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/coupon")
@CrossOrigin(origins = "http://localhost:5173")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService){
        this.couponService = couponService;
    }

    @PostMapping("")
    public ResponseDto createCoupon(@RequestBody CouponReqDto couponReqDto){
        Coupon coupon = couponService.createCoupon(couponReqDto);
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_COUPON, new DefaultResponse<Integer>(coupon.getCouponNo()));
    }

    @GetMapping("")
    public ResponseDto findAllCoupon(){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_COUPON, new DefaultResponse.ListResponse<CouponResDto>(couponService.findAllCoupons()));
    }

    @GetMapping("/{coupon_no}")
    public ResponseDto findCouponByNo(@PathVariable int coupon_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_COUPON, new DefaultResponse<CouponResDto>(couponService.findCouponByNo(coupon_no)));
    }

    @PutMapping("/{coupon_no}")
    public ResponseDto updateCoupon(@PathVariable int coupon_no, @RequestBody CouponReqDto couponReqDto){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_COUPON, new DefaultResponse<CouponResDto>(couponService.updateCoupon(coupon_no, couponReqDto)));
    }

    @DeleteMapping("/{coupon_no}")
    public ResponseDto deleteCoupon(@PathVariable int coupon_no){
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_COUPON, new DefaultResponse<Integer>(couponService.deleteCoupon(coupon_no)));
    }
}
