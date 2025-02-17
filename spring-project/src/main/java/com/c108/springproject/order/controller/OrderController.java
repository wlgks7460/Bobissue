package com.c108.springproject.order.controller;

import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.order.dto.request.OrderCreateReqDto;
import com.c108.springproject.order.dto.request.OrderUpdateReqDto;
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

    @PostMapping
    public ResponseDto createOrder(@RequestBody OrderCreateReqDto orderCreateReqDto) {
        return new ResponseDto( HttpStatus.CREATED, ResponseCode.SUCCESS_CREATE_ORDER, new DefaultResponse<>(orderService.createOrder(orderCreateReqDto)));
    }

    @GetMapping
    public ResponseDto getAllOrders() {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_ORDERS, new DefaultResponse<>(orderService.findAllOrders()));
    }

    @GetMapping("/{orderNo}")
    public ResponseDto getOrder(@PathVariable Long orderNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ORDER, new DefaultResponse<>(orderService.findOrder(orderNo)));
    }
    @PutMapping("/{orderNo}")
    public ResponseDto updateOrder(@PathVariable Long orderNo, @RequestBody OrderUpdateReqDto orderUpdateReqDto) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_UPDATE_ORDER, new DefaultResponse<>(orderService.updateOrder(orderNo, orderUpdateReqDto)));
    }

    @GetMapping("/cancel/{orderNo}")
    public ResponseDto getCancelOrders(@PathVariable Long orderNo) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_CANCEL_ORDERS, new DefaultResponse<>(orderService.findCancelOrders(orderNo)));
    }




}