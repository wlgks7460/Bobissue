package com.c108.springproject.address.repository;

import com.c108.springproject.address.domain.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findAllByUserUserNoAndDelYn(int userNo, String delYn);

    Optional<Address> findByAddressNoAndDelYn(int addressNo, String delYn);
}
