package com.c108.springproject.delivery.service;

import com.c108.springproject.delivery.domain.Delivery;
import com.c108.springproject.delivery.domain.DeliveryStatus;
import com.c108.springproject.delivery.dto.CompanyOrdersResDto;
import com.c108.springproject.delivery.dto.DeliveryReqDto;
import com.c108.springproject.delivery.dto.UserInfoDto;
import com.c108.springproject.delivery.repository.DeliveryRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.OrderDetail;
import com.c108.springproject.order.domain.OrderStatus;
import com.c108.springproject.order.dto.response.OrderDetailResDto;
import com.c108.springproject.order.repository.OrderDetailRepository;
import com.c108.springproject.order.repository.OrderRepository;
import jakarta.persistence.EntityNotFoundException;
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
    private final DeliveryRepository deliveryRepository;

    public DeliveryService(OrderDetailRepository orderDetailRepository, OrderRepository orderRepository, DeliveryRepository deliveryRepository){
        this.orderDetailRepository = orderDetailRepository;
        this.orderRepository = orderRepository;
        this.deliveryRepository = deliveryRepository;
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
        Order order = orderRepository.findById(orderNo).orElseThrow(() -> new BobIssueException(ResponseCode.ORDER_NOT_FOUND));
        order.setDelCategoryNo(deliveryStatus);

        return OrderDetailResDto.toDto(order);
    }


    @Transactional
    public void assignDeliveryToOrderDetail(Long orderDetailNo, String courier, String trackingNumber) {
        OrderDetail orderDetail = orderDetailRepository.findById(orderDetailNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.NOT_FOUND_ORDER_DETAIL));

        // 기존 배송 정보 확인 (이미 존재하는 경우 업데이트 or 유지)
        if (orderDetail.getDelivery() != null) {
            Delivery existingDelivery = orderDetail.getDelivery();
            if (!existingDelivery.getTrackingNumber().equals(trackingNumber) || !existingDelivery.getCourier().equals(courier)) {
                // 기존 배송 정보와 다르면 새로운 배송 정보 할당
                Delivery newDelivery = deliveryRepository.findByTrackingNumberAndCourier(trackingNumber, courier)
                        .orElseGet(() -> createNewDelivery(trackingNumber, courier));
                orderDetail.setDelivery(newDelivery);
            }
        } else {
            // 기존 배송 정보가 없으면 새로 생성
            Delivery newDelivery = deliveryRepository.findByTrackingNumberAndCourier(trackingNumber, courier)
                    .orElseGet(() -> createNewDelivery(trackingNumber, courier));
            orderDetail.setDelivery(newDelivery);
        }

        orderDetailRepository.save(orderDetail);
    }


    @Transactional
    Delivery createNewDelivery(String trackingNumber, String courier) {
        Delivery delivery = new Delivery();
        delivery.setTrackingNumber(trackingNumber);
        delivery.setCourier(courier);
        delivery.setDeliveryStatus(DeliveryStatus.ORDER_RECEIVED);
        return deliveryRepository.save(delivery);
    }

}
