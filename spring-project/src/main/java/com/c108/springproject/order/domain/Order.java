package com.c108.springproject.order.domain;

import com.c108.springproject.address.domain.Address;
import com.c108.springproject.coupon.domain.Coupon;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.user.domain.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")  // 예약어라서 테이블명을 orders로 지정
public class Order extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long orderNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "address_no", nullable = false)
    private Address address;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coupon_no", nullable = false)
    private Coupon coupon;

    @Setter
    @Column(nullable = false)
    private int orderCategoryNo;

    @Setter
    @Column(nullable = false)
    private int delCategoryNo;

    @Column(nullable = false, length = 255)
    private String payment;

    @Column(nullable = false)
    private int totalPrice;

    @Column(nullable = true, length = 255)
    private String requests;

    @Column
    private int usePoint;

    @Column(nullable = false)
    private int getPoint;

    @Column(nullable = false)
    private int paymentPrice;

    // 양방향 관계 설정
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OrderDetail> orderDetails = new ArrayList<>();

    // 주문 상태 변경 메서드
    public void updateOrder(String requests, int orderCategoryNo, int delCategoryN) {
        if (requests != null) this.requests = requests;
        this.orderCategoryNo = orderCategoryNo;
        this.delCategoryNo = delCategoryNo;
    }
}