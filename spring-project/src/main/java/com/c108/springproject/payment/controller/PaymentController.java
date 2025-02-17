package com.c108.springproject.payment.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.item.service.ItemService;
import com.c108.springproject.payment.dto.PaymentItemReqDto;
import com.c108.springproject.payment.dto.UserOrderResDto;
import com.c108.springproject.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final ItemService itemService;
    private final PaymentService paymentService;

    @Autowired
    public PaymentController(ItemService itemService, PaymentService paymentService) {
        this.itemService = itemService;
        this.paymentService = paymentService;
    }

    @PostMapping("/orderable")
    public ResponseDto checkOrder(@RequestBody List<PaymentItemReqDto> paymentList) {

        if(paymentService.checkOrder(paymentList)) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();

            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_ORDERABLE, new DefaultResponse<UserOrderResDto>(paymentService.getUserOrderInfo(email)));
        }
        else {
            paymentService.unorderable(paymentList); // 주문 실패에서 차감한 수량 더하기
            return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_ORDERABLE, new DefaultResponse<Boolean>(false));
        }
    }

}
