package com.c108.springproject.coupon.service;

import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.coupon.dto.request.CouponReqDto;
import com.c108.springproject.coupon.dto.response.CouponResDto;
import com.c108.springproject.coupon.repository.CouponRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.repository.CompanyRepository;
import com.c108.springproject.seller.repository.SellerRepository;
import jakarta.transaction.Transactional;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CouponService {

    private final CouponRepository couponRepository;
    private final SellerRepository sellerRepository;
    private final CompanyRepository companyRepository;

    public CouponService(CouponRepository couponRepository,
                         SellerRepository sellerRepository,
                         CompanyRepository companyRepository){
        this.couponRepository = couponRepository;
        this.sellerRepository = sellerRepository;
        this.companyRepository = companyRepository;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN','SELLER')")
    public Coupon createCoupon(CouponReqDto couponReqDto){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority)
                .anyMatch(role-> role.equals("ADMIN"));

        Company company;
        if (isAdmin) {
            company = companyRepository.findByCompanyNo(0).orElseThrow(()->new BobIssueException(ResponseCode.COMPANY_NOT_FOUND));  // ADMIN이면 0
        } else {
            // SELLER라면 회사 정보 가져오기 (예: UserService에서 조회)
            Seller seller = sellerRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
            company = seller.getCompany();
        }

        try{
            Coupon new_coupon = Coupon.builder()
                    .name(couponReqDto.getName())
                    .content(couponReqDto.getContent())
                    .deductedPrice(couponReqDto.getDeductedPrice())
                    .minDeliveryPrice(couponReqDto.getMinDeliveryPrice())
                    .companyNo(company)
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
            return coupon.getCouponNo();
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_DELETE_COUPON);
        }
    }
}
