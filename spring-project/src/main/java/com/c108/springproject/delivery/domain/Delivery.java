package com.c108.springproject.delivery.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.OrderDetail;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Delivery extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long deliveryNo;

    @Column(nullable = false)
    String courier; // 택배사

    @Column(nullable = false)
    String trackingNumber; // 송장번호

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DeliveryStatus deliveryStatus; // 배송 상태

    public void updateStatus(DeliveryStatus status) {
        this.deliveryStatus = status;
    }

}
