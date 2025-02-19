package com.c108.springproject.delivery.controller;

import com.c108.springproject.delivery.dto.CompanyOrdersResDto;
import com.c108.springproject.delivery.dto.DeliveryReqDto;
import com.c108.springproject.delivery.service.DeliveryService;
import com.c108.springproject.global.DefaultResponse;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.dto.ResponseDto;
import com.c108.springproject.order.dto.response.OrderDetailResDto;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    // 배송 전 주문 리스트 조회
    @GetMapping("/{companyNo}/{deliveryStatus}")
    public ResponseDto getOrders(@PathVariable int companyNo, @PathVariable int deliveryStatus) {
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ALL_ORDERS, new DefaultResponse<List<CompanyOrdersResDto>>(deliveryService.getOrders(companyNo, deliveryStatus)));
    }

    // 배송 상태 변경
    @PostMapping("/{orderNo}/{deliveryStatus}")
    public ResponseDto updateDeliveryStatus(@PathVariable long orderNo, @PathVariable int deliveryStatus) {
        // 2: 상품 준비중 / 3: 배송 출발 / 4: 배송 완료
        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ORDER, new DefaultResponse<OrderDetailResDto>(deliveryService.setOrder(orderNo, deliveryStatus)));
    }

//    @PostMapping("/{orderNo}")
//    public ResponseDto setDelivery(@PathVariable long orderNo,@RequestBody DeliveryReqDto deliveryReqDto) {
//        return new ResponseDto(HttpStatus.OK, ResponseCode.SUCCESS_FIND_ORDER, new DefaultResponse<OrderDetailResDto>(deliveryService.setDelivery(orderNo, deliveryReqDto)));
//    }

}
