package com.c108.springproject.order.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.order.dto.request.OrderCreateReqDto;
import com.c108.springproject.order.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    // 생성자 주입
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("")
    public ResponseDto createOrder(@RequestBody OrderCreateReqDto orderCreateReqDto) {
        return new ResponseDto(
                HttpStatus.CREATED,
                ResponseCode.SUCCESS_CREATE_ORDER,  // 성공 코드는 ResponseCode에 추가 필요
                new DefaultResponse<>(orderService.createOrder(orderCreateReqDto))
        );
    }
}