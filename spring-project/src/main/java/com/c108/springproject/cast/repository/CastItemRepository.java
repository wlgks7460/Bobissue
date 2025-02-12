package com.c108.springproject.cast.repository;

import com.c108.springproject.cast.domain.Cast;
import com.c108.springproject.cast.domain.CastItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CastItemRepository extends JpaRepository<CastItem, Long> {
    List<CastItem> findByCast(Cast cast);
    void deleteByCast(Cast cast);
}
