package com.c108.springproject.item.repository;

import com.c108.springproject.item.domain.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
    List<Item> findByDelYn(String delYn);
}
