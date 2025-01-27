package com.c108.springproject.order.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.item.domain.Item;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigInteger;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "order_detail")
public class OrderDetail extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int orderDetailNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_no", nullable = false)
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item_no", nullable = false)
    private Item item;

    @Column(nullable = false)
    private int count;

    @Column(nullable = false)
    private int price;

    // 주문 상세 정보 수정 메서드
    public void updateOrderDetail(int count, int price) {
        this.count = count;
        this.price = price;
    }
}