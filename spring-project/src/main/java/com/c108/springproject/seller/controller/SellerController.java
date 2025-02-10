package com.c108.springproject.seller.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.seller.dto.SellerDto;
import com.c108.springproject.seller.dto.SellerProfiltResDto;
import com.c108.springproject.seller.dto.SellerUpdateReq;
import com.c108.springproject.seller.dto.SignUpReqDto;
import com.c108.springproject.seller.service.MailService;
import com.c108.springproject.seller.service.SellerService;
import com.c108.springproject.seller.dto.EmailReqDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    private final SellerService sellerService;
    private final MailService mailService;

    @Autowired
    public SellerController(SellerService sellerService, MailService mailService) {
        this.sellerService = sellerService;
        this.mailService = mailService;
    }

    @PostMapping("sign-up")
    public ResponseDto signUp(@RequestBody SignUpReqDto signUpDto) {
        return new ResponseDto(HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_SELLER, sellerService.signUp(signUpDto));
    }

    @GetMapping
    public ResponseDto findSellerList() {
        List<SellerDto> sellerList = sellerService.findSellerList();
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_SELLER, new DefaultResponse<List<SellerDto>>(sellerList));
    }

    @GetMapping("/{sellerNo}")
    public ResponseDto findSellerById(@PathVariable int sellerNo) {
        SellerDto sellerList = sellerService.findSellerById(sellerNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_SELLER, new DefaultResponse<SellerDto>(sellerList));

    }

    @PutMapping("/{sellerNo}")
    public ResponseDto updateSeller(@PathVariable int sellerNo, @RequestBody SellerUpdateReq sellerUpdateReq) {
        sellerService.updateSeller(sellerNo, sellerUpdateReq);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_SELLER, new DefaultResponse<SellerUpdateReq>(sellerUpdateReq));
    }


    @DeleteMapping("/{sellerNo}")
    public ResponseDto deleteSeller(@PathVariable int sellerNo) {
        sellerService.deleteSeller(sellerNo);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_DELETE_USER, null);
    }

    @GetMapping("/profile")
    public ResponseDto sellerProfile() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_SELLER, new DefaultResponse<SellerProfiltResDto>(sellerService.sellerProfile()));
    }

    @PostMapping("/mail")
    public ResponseDto sendEmail(@RequestBody EmailReqDto emailReqDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        mailService.sendMail(email, emailReqDto);
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_SEND_EMAIL, new DefaultResponse<String>(emailReqDto.getRecipient()));
    }
}
