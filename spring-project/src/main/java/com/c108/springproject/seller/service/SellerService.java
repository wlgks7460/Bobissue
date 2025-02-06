package com.c108.springproject.seller.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.SellerDto;
import com.c108.springproject.seller.dto.SellerProfiltResDto;
import com.c108.springproject.seller.dto.SellerUpdateReq;
import com.c108.springproject.seller.dto.SignUpReqDto;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository, UserRepository userRepository) {
        this.sellerRepository = sellerRepository;
    }

    @Transactional
    public int signUp(SignUpReqDto signUpDto) {
        Seller new_seller = Seller.builder()
                .email(signUpDto.getEmail())
                .password(signUpDto.getPassword())
                .callNumber(signUpDto.getCallNumber())
                .name(signUpDto.getName())
                .status("Y")
                .build();

        sellerRepository.save(new_seller);
        return new_seller.getSellerNo();
    }

    @Transactional
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


        return sellerRepository.findAllActiveSellers().stream()
                .map(SellerDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public SellerDto findSellerById(int sellerNo) {

        return sellerRepository.findById(sellerNo)
                .filter(seller -> !"Y".equals(seller.getDelYn()))
                .map(SellerDto::new)
                .orElse(null);
    }

    @Transactional
    public void updateSeller(int sellerNo, SellerUpdateReq sellerUpdateReq) {
        try{
            Seller seller = sellerRepository.findById(sellerNo).orElse(null);
            seller.updateSeller(sellerUpdateReq);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_SELLER);
        }
    }

    @Transactional
    public void deleteSeller(int sellerNo) {
        Seller seller=sellerRepository.findById(sellerNo).orElseThrow(()->
                new BobIssueException(ResponseCode.FAILED_DELETE_SELLER));
        seller.delete();
    }

    @Transactional
    public SellerProfiltResDto sellerProfile(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Seller seller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

        return SellerProfiltResDto.toDto(seller);
    }


}
