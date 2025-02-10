package com.c108.springproject.cast.repository;

import com.c108.springproject.cast.domain.CastItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CastItemRepository extends JpaRepository<CastItem, Long> {
}
