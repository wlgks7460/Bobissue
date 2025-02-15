package com.c108.springproject.seller.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.domain.Company;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.SellerDto;
import com.c108.springproject.seller.dto.SellerProfiltResDto;
import com.c108.springproject.seller.dto.SellerUpdateReq;
import com.c108.springproject.seller.dto.SignUpReqDto;
import com.c108.springproject.seller.dto.querydsl.ItemRankingDto;
import com.c108.springproject.seller.dto.request.ExtraAccountReqDto;
import com.c108.springproject.seller.dto.response.ExtraAccountResDto;
import com.c108.springproject.seller.repository.SellerQueryRepository;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;
    private final SellerQueryRepository sellerQueryRepository;

    public SellerService(SellerRepository sellerRepository, UserRepository userRepository, SellerQueryRepository sellerQueryRepository) {
        this.sellerRepository = sellerRepository;
        this.sellerQueryRepository = sellerQueryRepository;
    }

    @Transactional
    public int signUp(SignUpReqDto signUpDto) {
        try {
            Seller new_seller = Seller.builder()
                    .email(signUpDto.getEmail())
                    .password(signUpDto.getPassword())
                    .callNumber(signUpDto.getCallNumber())
                    .name(signUpDto.getName())
                    .status("Y")
                    .approvalStatus("N") // 판매 가능 기본값 No
                    .build();

            sellerRepository.save(new_seller);
            return new_seller.getSellerNo();
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_SIGNUP_SELLER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('ADMIN')")
    public List<SellerDto> findSellerList() {

//        List<Seller> sellers = sellerRepository.findAll();
//        List<SellerDto> sellerDtos = new ArrayList<>();
//
//        try{
//            for(Seller seller : sellers){
//                sellerDtos.add(new SellerDto(seller));
//            }
//            return sellerDtos;
//        }catch (BobIssueException e){
//            throw new BobIssueException(ResponseCode.SELLER_NOT_FOUND);
//        }

        try {
            return sellerRepository.findSellersByDelYn("N").stream()
                    .map(SellerDto::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_ALL_SELLER);
        }
    }

    @Transactional
    public SellerDto findSellerById(int sellerNo) {
        try {
            return sellerRepository.findById(sellerNo)
                    .filter(seller -> !"Y".equals(seller.getDelYn()))
                    .map(SellerDto::new)
                    .orElse(null);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_SELLER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public void updateSeller(int sellerNo, SellerUpdateReq sellerUpdateReq) {
        try{
            Seller seller = sellerRepository.findById(sellerNo).orElse(null);
            seller.updateSeller(sellerUpdateReq);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_SELLER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public void deleteSeller(int sellerNo) {
        Seller seller=sellerRepository.findById(sellerNo).orElseThrow(()->
                new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        try {
            seller.delete();
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_DELETE_SELLER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public SellerProfiltResDto sellerProfile(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Seller seller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
        try {
           return SellerProfiltResDto.toDto(seller);
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_FIND_SELLER);
        }
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public List<ExtraAccountResDto> createExtraAccounts(List<ExtraAccountReqDto> extraAccountReqDtos) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Seller seller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        String curApprovalStatus = seller.getApprovalStatus();

        if (curApprovalStatus.equals("N")) {
            throw new BobIssueException(ResponseCode.NOT_APPROVED_SELLER);
        }

        Company company = seller.getCompany();

        if (company == null) {
            throw new BobIssueException(ResponseCode.COMPANY_NOT_FOUND);
        }

        return extraAccountReqDtos.stream()
                .map(reqDto -> {
                    if (sellerRepository.existsByEmail(reqDto.getEmail())) {
                        throw new BobIssueException(ResponseCode.DUPLICATE_EMAIL);
                    }

                    Seller newSeller = Seller.builder()
                            .email(reqDto.getEmail())
                            .password(reqDto.getPassword())
                            .callNumber(reqDto.getCallNumber())
                            .name(reqDto.getName())
                            .company(company)
                            .status("Y")
                            .approvalStatus("N")
                            .build();

                    return ExtraAccountResDto.toDto(sellerRepository.save(newSeller));
                })
                .collect(Collectors.toList());
    }

    
    // 아이템 통계 조회
    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public List<ItemRankingDto> getItemRankings(SellerQueryRepository.SalesPeriod period) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        Seller seller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        int companyNo = seller.getCompany().getCompanyNo();

        return sellerQueryRepository.getItemRankings(companyNo, period);
    }
}
