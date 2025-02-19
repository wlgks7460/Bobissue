package com.c108.springproject.delivery.repository;

import com.c108.springproject.delivery.domain.Delivery;
import com.c108.springproject.order.domain.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository  extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByTrackingNumberAndCourier(String trackingNumber, String courier);
}
