package com.c108.springproject.seller.repository;

import com.c108.springproject.seller.domain.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller, Integer> {
    @Query("SELECT s FROM Seller s WHERE s.delYn = 'N'")
    List<Seller> findAllActiveSellers();
}
