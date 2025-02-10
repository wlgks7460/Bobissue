package com.c108.springproject.order.repository;

import com.c108.springproject.order.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;
import java.util.List;

import java.time.LocalDateTime;


@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByOrderCategoryNo(int orderCategoryNo);

    @Query("SELECT SUM(o.totalPrice) " +
            "FROM Order o " +
            "WHERE o.userNo = :userNo " +
            "AND o.orderCategoryNo = 2 " +
            "AND o.createdAt BETWEEN :startDate AND :endDate")
    Integer getTotalPriceByUserForMonth(@Param("userNo") int userNo,
                                        @Param("startDate") LocalDateTime startDate,
                                        @Param("endDate") LocalDateTime endDate);


}
