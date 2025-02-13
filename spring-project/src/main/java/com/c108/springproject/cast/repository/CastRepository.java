package com.c108.springproject.cast.repository;

import com.c108.springproject.cast.domain.Cast;
import com.c108.springproject.cast.domain.CastStatus;
import com.c108.springproject.seller.domain.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CastRepository extends JpaRepository<Cast, Integer> {
    Optional<Cast> findByCastNo(int castNo);
    List<Cast> findByCastStatus(CastStatus castStatus);

    Optional<Cast> findByCastStatusAndCompany(CastStatus castStatus, Company company);
}
