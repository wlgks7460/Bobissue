package com.c108.springproject.order.repository;

import com.c108.springproject.order.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByOrderCategoryNo(int orderCategoryNo);
}
