package com.c108.springproject.delivery.service;

import com.c108.springproject.delivery.dto.CompanyOrdersResDto;
import com.c108.springproject.delivery.dto.DeliveryReqDto;
import com.c108.springproject.delivery.dto.UserInfoDto;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.OrderDetail;
import com.c108.springproject.order.domain.OrderStatus;
import com.c108.springproject.order.dto.response.OrderDetailResDto;
import com.c108.springproject.order.repository.OrderDetailRepository;
import com.c108.springproject.order.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class DeliveryService {


    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;

    public DeliveryService(OrderDetailRepository orderDetailRepository, OrderRepository orderRepository){
        this.orderDetailRepository = orderDetailRepository;
        this.orderRepository = orderRepository;
    }

    // 주문 확인 중인 주문들
    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public List<CompanyOrdersResDto> getOrders(int companyNo, int deliveryStatus){
        List<OrderDetail> list;
        if (deliveryStatus == 0) {
            list = orderDetailRepository.findByItem_Company_CompanyNo(companyNo);
        }else{
            list = orderDetailRepository.findByItem_Company_CompanyNoAndOrder_DelCategoryNo(companyNo,deliveryStatus);
        }
        List<CompanyOrdersResDto> result = new ArrayList<>();

        for (OrderDetail detail : list) {
            HashMap<Integer, Integer> itemsMap = new HashMap<>();
            itemsMap.put(detail.getItem().getItemNo(), detail.getCount());

            Order order = orderRepository.findByOrderNo(detail.getOrder().getOrderNo()).orElseThrow(()-> new BobIssueException(ResponseCode.ORDER_NOT_FOUND));
            UserInfoDto userInfoDto = UserInfoDto.builder()
                    .userName(order.getUser().getName())
                    .address(order.getAddress())
                    .userPhoneNumber(order.getUser().getPhoneNumber())
                    .request(order.getRequests())
                    .build();

            CompanyOrdersResDto orderDto = CompanyOrdersResDto.builder()
                    .orderNo(detail.getOrder().getOrderNo())
                    .items(itemsMap)
                    .userInfo(userInfoDto)
                    .build();
            result.add(orderDto);
        }

        return result;
    }

    @Transactional
    @PreAuthorize("hasAnyAuthority('SELLER')")
    public OrderDetailResDto setOrder(long orderNo, int deliveryStatus){
        System.out.println("1234");
        Order order = orderRepository.findById(orderNo).orElseThrow(() -> new BobIssueException(ResponseCode.ORDER_NOT_FOUND));
        System.out.println("1234");
        order.setDelCategoryNo(deliveryStatus);
        System.out.println("1234");

        return OrderDetailResDto.toDto(order);
    }

    // 매일 자정에 실행 (크론 표현식: "0 0 0 * * *")
//    @Scheduled(cron = "0 0 0 * * *")
//    @Transactional
//    public void confirmOrdersAfterTwoDays() {
//        LocalDatTime twoDaysAgo = LocalDateTime.now().minusDays(2);
//        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd HHmmss");
//
//        // 2일 전에 배송 완료된 주문 조회
//        List<OrderDetail> deliveredOrders = orderDetailRepository.findAllByDeliveryStatusAndUpdatedAtBefore(4, twoDaysAgo.format(formatter));
//
//        for (OrderDetail orderDetail : deliveredOrders) {
//            // 주문 상태를 '주문 확정(2)'으로 변경
//            OrderStatus orderStatus = new OrderStatus();
//            orderStatus.setOrderDetail(orderDetail);
//            orderStatus.setStatus(2);  // 2: 주문 확정
//            orderStatus.setUpdatedAt(LocalDateTime.now().format(formatter));
//            orderStatusRepository.save(orderStatus);
//
//            // OrderDetail에도 주문 상태 업데이트
//            orderDetail.setOrderStatus(2);
//            orderDetailRepository.save(orderDetail);
//        }
//    }

//    @Transactional
//    @PreAuthorize("hasAnyAuthority('SELLER')")
//    public OrderDetailResDto setDelivery(long orderNo, DeliveryReqDto deliveryReqDto) {
//        return OrderDetailResDto.toDto(order)
//    }
}
