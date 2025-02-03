package com.c108.springproject.seller.repository;

import com.c108.springproject.seller.domain.Seller;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Integer> {
    @Query("SELECT s FROM Seller s WHERE s.delYn = 'N'")
    List<Seller> findAllActiveSellers();

    @Modifying
    @Transactional
    @Query("UPDATE Seller s SET s.status = CASE WHEN s.status = 'Y' THEN 'N' ELSE 'Y' END WHERE s.sellerNo = :sellerNo")
    void changeSellerStatus(int sellerNo);

    @Query("SELECT s.status FROM Seller s WHERE s.sellerNo = :sellerNo")
    String findSellerStatus(int sellerNo);

    Optional<Seller> findBySellerNo(int sellerNo);
    Optional<Seller> findByEmail(String email);

}
