package com.c108.springproject.address.repository;

import com.c108.springproject.address.domain.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<Address, Integer> {

    List<Address> findAllByUserId(int userNo);
}
