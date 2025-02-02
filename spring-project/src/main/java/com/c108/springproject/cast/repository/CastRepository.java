package com.c108.springproject.cast.repository;

import com.c108.springproject.cast.domain.Cast;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CastRepository extends JpaRepository<Cast, Integer> {
    Optional<Cast> findByCastNo(int castNo);
}
