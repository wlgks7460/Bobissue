package com.c108.springproject.order.service;

import com.c108.springproject.address.domain.Address;
import com.c108.springproject.address.repository.AddressRepository;
import com.c108.springproject.admin.domain.AdminBank;
import com.c108.springproject.admin.repository.AdminBankRepository;
import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.coupon.repository.CouponRepository;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.repository.ItemRepository;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.OrderDetail;
import com.c108.springproject.order.domain.OrderStatus;
import com.c108.springproject.order.domain.DeliveryStatus;
import com.c108.springproject.order.dto.request.OrderCreateReqDto;
import com.c108.springproject.order.dto.request.OrderItemReqDto;
import com.c108.springproject.order.dto.request.OrderUpdateReqDto;
import com.c108.springproject.order.dto.response.OrderCreateResDto;
import com.c108.springproject.order.dto.response.OrderDetailResDto;
import com.c108.springproject.order.dto.response.OrderListResDto;
import com.c108.springproject.order.dto.response.OrderUpdateResDto;
import com.c108.springproject.order.repository.DeliveryStatusRepository;
import com.c108.springproject.order.repository.OrderDetailRepository;
import com.c108.springproject.order.repository.OrderRepository;
import com.c108.springproject.order.repository.OrderStatusRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ItemRepository itemRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final DeliveryStatusRepository deliveryStatusRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final CouponRepository couponRepository;
    private final AdminBankRepository adminBankRepository;

    public OrderService(OrderRepository orderRepository, OrderDetailRepository orderDetailRepository, ItemRepository itemRepository, OrderStatusRepository orderStatusRepository, DeliveryStatusRepository deliveryStatusRepository, UserRepository userRepository, AddressRepository addressRepository, CouponRepository couponRepository,AdminBankRepository adminBankRepository) {
        this.orderRepository = orderRepository;
        this.orderDetailRepository = orderDetailRepository;
        this.itemRepository = itemRepository;
        this.orderStatusRepository = orderStatusRepository;
        this.deliveryStatusRepository = deliveryStatusRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.couponRepository = couponRepository;
        this.adminBankRepository = adminBankRepository;
    }

    @Transactional
    public OrderCreateResDto createOrder(OrderCreateReqDto request) {
        User user = userRepository.findById(request.getUserNo()).orElseThrow(()-> new BobIssueException(ResponseCode.USER_NOT_FOUND));
        Address address = addressRepository.findById(request.getAddressNo()).orElseThrow(()-> new BobIssueException(ResponseCode.FAILED_FIND_CALENDAR));
        try {
            // 주문 금액 계산
            int totalPrice = calculateTotalPrice(request.getItems());
            Coupon coupon = couponRepository.findByCouponNo(request.getUserCouponNo()).orElseThrow(()-> new BobIssueException(ResponseCode.COUPON_NOT_FOUND));
            int couponPrice = coupon.getDeductedPrice();
            int paymentPrice = totalPrice - couponPrice - request.getUsePoint();

            //  주문 기본 정보 생성
            Order order = Order.builder()
                    .user(user)
                    .address(address)
                    .coupon(coupon)
                    .payment(request.getPayment())
                    .requests(request.getRequests())
                    .orderCategoryNo(1)  // 초기 주문 상태
                    .delCategoryNo(1)    // 초기 배송 상태
                    .totalPrice(totalPrice)
                    .usePoint(request.getUsePoint())
                    .paymentPrice(paymentPrice)
                    .orderDetails(new ArrayList<>())
                    .build();

            // 쿠폰 사용 후 삭제
            coupon.delete();

            // 주문 상세 정보 (OrderDetail data) 생성
            createOrderDetails(order, request.getItems());

            // 관리자 계좌로 입금
            AdminBank adminBank = adminBankRepository.findById(1).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_ADMIN_BANK));
            adminBank.setBankBalance(adminBank.getBankBalance() + paymentPrice);

            return OrderCreateResDto.toDto(orderRepository.save(order));
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_CREATE_ORDER);
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

    // 그냥 전체 조회
    @Transactional
    public List<OrderListResDto> findAllOrders() {
        List<Order> orders = orderRepository.findAll();
        List<OrderListResDto> orderListResDtos = new ArrayList<>();
        for(Order order: orders) {
            String orderStatus = getOrderStatus(order.getOrderCategoryNo());
            String deliveryStatus = getDeliveryStatus(order.getDelCategoryNo());
            orderListResDtos.add(OrderListResDto.toDto(order, orderStatus, deliveryStatus));
        }
        return orderListResDtos;
    }


    // 상세 조회
    @Transactional
    public OrderDetailResDto findOrder(Long orderNo) {
        Order order = orderRepository.findById(orderNo)
                .orElseThrow(() -> new BobIssueException(ResponseCode.ORDER_NOT_FOUND));
        return OrderDetailResDto.toDto(order);
    }

    public String getOrderStatus(int orderStatusNo) {
        return orderStatusRepository.findByOrderStatusNo(orderStatusNo)
                .map(OrderStatus::getName)
                .orElse("조회 실패");
    }

    public String getDeliveryStatus(int delCategoryNo) {
        return deliveryStatusRepository.findByDelCategoryNo(delCategoryNo)
                .map(DeliveryStatus::getName)
                .orElse("조회 실패");
    }

    @Transactional
    public OrderUpdateResDto updateOrder(Long orderNo, OrderUpdateReqDto request) {
        try {
            // 주문 조회
            Order order = orderRepository.findById(orderNo)
                    .orElseThrow(() -> new BobIssueException(ResponseCode.ORDER_NOT_FOUND));
            // 주문 취소 시 재고 복구
            if (request.getOrderCategoryNo() == 4) {  // 주문 취소
                for (OrderDetail detail : order.getOrderDetails()) {
                    detail.getItem().setStock(detail.getItem().getStock()+detail.getCount());
                }
            }

            // 주문 정보 업데이트
            order.updateOrder(
                    request.getRequests(),
                    request.getOrderCategoryNo(),
                    request.getDelCategoryNo()
            );

            // 저장
            Order updatedOrder = orderRepository.save(order);

            // 주문 상태 조회
            String orderStatus = getOrderStatus(updatedOrder.getOrderCategoryNo());
            String deliveryStatus = getDeliveryStatus(updatedOrder.getDelCategoryNo());

            return OrderUpdateResDto.toDto(updatedOrder, orderStatus, deliveryStatus);
        } catch (BobIssueException e) {
            throw new BobIssueException(ResponseCode.FAILED_UPDATE_ORDER);
        }

    }

    // orderNo인 order취소
    @Transactional
    public OrderDetailResDto findCancelOrders(long orderNo) {
        Order order = orderRepository.findById(orderNo).orElseThrow(()-> new BobIssueException(ResponseCode.ORDER_NOT_FOUND));
        User user=order.getUser();
        user.setPoint(user.getPoint()+order.getUsePoint());

        // 관리자 계좌에서 출금
        AdminBank adminBank = adminBankRepository.findById(1).orElseThrow(()-> new BobIssueException(ResponseCode.NOT_FOUND_ADMIN_BANK));
        adminBank.setBankBalance(adminBank.getBankBalance() - order.getPaymentPrice());
        order.setOrderCategoryNo(4); // 주문 취소 완료

        return OrderDetailResDto.toDto(order);
    }




}
