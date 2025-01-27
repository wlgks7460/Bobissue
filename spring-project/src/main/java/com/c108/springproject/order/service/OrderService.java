package com.c108.springproject.order.service;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.OrderDetail;
import com.c108.springproject.order.dto.request.OrderCreateReqDto;
import com.c108.springproject.order.dto.request.OrderItemReqDto;
import com.c108.springproject.order.dto.response.OrderCreateResDto;
import com.c108.springproject.order.repository.OrderDetailRepository;
import com.c108.springproject.order.repository.OrderRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ItemRepository itemRepository;


    public OrderService(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository, ItemRepository itemRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.itemRepository = itemRepository;
    }

    @Transactional
    public OrderCreateResDto createOrder(OrderCreateReqDto request) {
        try {
            // 1. 주문할 상품들의 재고 확인
            validateItems(request.getItems());

            // 2. 전체 주문 금액 계산
            int totalPrice = calculateTotalPrice(request.getItems());

            // 3. 주문 기본 정보 생성
            Order order = Order.builder()
                    .userNo(request.getUserNo())
                    .addressNo(request.getAddressNo())
                    .userCouponNo(request.getUserCouponNo())
                    .payment(request.getPayment())
                    .requests(request.getRequests())
                    .orderCategoryNo(1)  // 초기 주문 상태
                    .delCategoryNo(1)    // 초기 배송 상태
                    .totalPrice(totalPrice)
                    .orderDetails(new ArrayList<>())
                    .build();

            // 4. 주문 상세 정보 생성
            createOrderDetails(order, request.getItems());

            // 5. 주문 저장
            Order savedOrder = orderRepository.save(order);

            // 6. 응답 DTO
            return OrderCreateResDto.toDto(savedOrder);

        } catch (BobIssueException e) {
            throw e;
        } catch (Exception e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_ORDER);
        }
    }

    // 재고 확인
    private void validateItems(List<OrderItemReqDto> items) {
        for (OrderItemReqDto item : items) {
            Item foundItem = itemRepository.findById(item.getItemNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

            if (foundItem.getStock() < item.getCount()) {
                throw new BobIssueException(ResponseCode.NOT_ENOUGH_STOCK);
            }
        }
    }

    // 전체 주문 금액 계산
    private int calculateTotalPrice(List<OrderItemReqDto> items) {
        int totalPrice = 0;
        for (OrderItemReqDto item : items) {
            Item foundItem = itemRepository.findById(item.getItemNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));
            totalPrice += foundItem.getPrice() * item.getCount();
        }
        return totalPrice;
    }

    // 주문 상세 정보 생성
    private void createOrderDetails(Order order, List<OrderItemReqDto> items) {
        for (OrderItemReqDto itemDto : items) {
            // 상품 조회
            Item item = itemRepository.findById(itemDto.getItemNo())
                    .orElseThrow(() -> new BobIssueException(ResponseCode.ITEM_NOT_FOUND));

            // 재고 감소
            item.decreaseStock(itemDto.getCount());

            // 주문 상세 정보 생성
            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .item(item)
                    .count(itemDto.getCount())
                    .price(item.getPrice() * itemDto.getCount())
                    .build();

            // Order에 OrderDetail 추가
            order.getOrderDetails().add(detail);
        }
    }
    
    // 수정 필드



    // 그냥 전체 조회



    // 상세 조회

}
