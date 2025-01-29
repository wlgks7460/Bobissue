package com.c108.springproject.seller.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.SellerDto;
import com.c108.springproject.seller.dto.SignUpReqDto;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SellerService {

    private final SellerRepository sellerRepository;

    public SellerService(SellerRepository sellerRepository, UserRepository userRepository) {
        this.sellerRepository = sellerRepository;
    }

    @Transactional
    public void signUp(SignUpReqDto signUpDto) {
        Seller new_seller = Seller.builder()
                .email(signUpDto.getEmail())
                .password(signUpDto.getPassword())
                .status("Y")
                .build();

        sellerRepository.save(new_seller);
    }

    @Transactional
    public List<SellerDto> findSellerList() {

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
    public void deleteSeller(int sellerNo) {
        Seller seller=sellerRepository.findById(sellerNo).orElseThrow(()->
                new BobIssueException(ResponseCode.FAILED_DELETE_SELLER));
        seller.delete();
    }



}
