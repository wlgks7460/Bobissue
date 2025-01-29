package com.c108.springproject.coupon.service;

import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.coupon.dto.request.CouponReqDto;
import com.c108.springproject.coupon.dto.response.CouponResDto;
import com.c108.springproject.coupon.repository.CouponRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository){
        this.couponRepository = couponRepository;
    }

    @Transactional
    public Coupon createCoupon(CouponReqDto couponReqDto){
        try{
            Coupon new_coupon = Coupon.builder()
                    .name(couponReqDto.getName())
                    .content(couponReqDto.getContent())
                    .deductedPrice(couponReqDto.getDeductedPrice())
                    .minDeliveryPrice(couponReqDto.getMinDeliveryPrice())
                    .term(couponReqDto.getTerm())
                    .build();
            return couponRepository.save(new_coupon);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_CREATE_COUPON);
        }
    }

    @Transactional
    public List<CouponResDto> findAllCoupons(){
        try {
            List<Coupon> coupons = couponRepository.findAll();
            List<CouponResDto> couponResDtos = new ArrayList<>();
            for(Coupon coupon : coupons){
                couponResDtos.add(CouponResDto.toDto(coupon));
            }
            return couponResDtos;
        }catch(BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_FIND_ALL_COUPON);
        }
    }

    @Transactional
    public CouponResDto findCouponByNo(int coupon_no){
        Coupon coupon = couponRepository.findByCouponNo(coupon_no).orElseThrow(()->new BobIssueException(ResponseCode.COUPON_NOT_FOUND));
        return CouponResDto.toDto(coupon);
    }

    @Transactional
    public CouponResDto updateCoupon(int coupon_no, CouponReqDto couponReqDto){
        Coupon coupon = couponRepository.findByCouponNo(coupon_no).orElseThrow(()-> new BobIssueException(ResponseCode.COUPON_NOT_FOUND));
        try{
            coupon.updateCoupon(couponReqDto);
            return CouponResDto.toDto(coupon);
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_COUPON);
        }
    }

    @Transactional
    public int deleteCoupon(int coupon_no){
        Coupon coupon = couponRepository.findByCouponNo(coupon_no).orElseThrow(()-> new BobIssueException(ResponseCode.COUPON_NOT_FOUND));
        try{
            coupon.delete();
            return coupon_no;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_COUPON);
        }
    }
}
