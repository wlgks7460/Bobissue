package com.c108.springproject.item.repository;

import com.c108.springproject.item.domain.Item;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findByDelYn(String delYn);

    @Query("SELECT i FROM Item i JOIN i.categoryNo c JOIN i.company co " +
            "WHERE (:search IS NULL OR i.name LIKE %:search% " +
            "OR c.name LIKE %:search% OR co.name LIKE %:search%)")
    List<Item> searchItems(@Param("search") String search);
}
