package com.c108.springproject.order.repository;

import com.c108.springproject.order.domain.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DeliveryStatusRepository extends JpaRepository<DeliveryStatus, Integer> {
    Optional<DeliveryStatus> findByDelCategoryNo(int delCategoryNo);
}
