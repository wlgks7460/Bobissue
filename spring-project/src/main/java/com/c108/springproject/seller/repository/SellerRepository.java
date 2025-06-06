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

    List<Seller> findSellersByDelYn(String delYn);

    Optional<Seller> findBySellerNo(int sellerNo);
    Optional<Seller> findByEmail(String email);

    List<Seller> findByCompanyCompanyNo(int companyNo);

    boolean existsByEmail(String email);
}
