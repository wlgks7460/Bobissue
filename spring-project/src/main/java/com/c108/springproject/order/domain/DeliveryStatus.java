package com.c108.springproject.order.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "delivery_status")
public class DeliveryStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int delCategoryNo;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, length = 15)
    private String createdAt;

    @Column(nullable = false, length = 15)
    private String updatedAt;
}