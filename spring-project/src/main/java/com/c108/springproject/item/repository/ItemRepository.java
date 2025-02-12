package com.c108.springproject.item.repository;

import com.c108.springproject.item.domain.Item;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findByDelYn(String delYn);

    @Query("SELECT i FROM Item i JOIN i.categoryNo c JOIN i.company co " +
            "WHERE (:search IS NULL OR LOWER(i.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(co.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Item> searchItems(@Param("search") String search, Pageable pageable);
}
