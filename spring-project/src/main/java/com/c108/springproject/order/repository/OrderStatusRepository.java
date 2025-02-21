package com.c108.springproject.order.repository;

import com.c108.springproject.order.domain.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderStatusRepository extends JpaRepository<OrderStatus, Integer> {
    Optional<OrderStatus> findByOrderStatusNo(int orderStatusNo);
    // Optional 데이터가 존재하지 않을 때 불상사를 막아준다? 안정성
}
