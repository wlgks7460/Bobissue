package com.c108.springproject.item.repository;

import com.c108.springproject.item.domain.ItemCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemCategoryRepository extends JpaRepository<ItemCategory, Integer> {
    List<ItemCategory> findByParentIsNull();
}
