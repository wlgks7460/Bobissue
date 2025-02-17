package com.c108.springproject.item.repository;

import com.c108.springproject.item.domain.ItemElastic;
import org.springframework.data.domain.Page;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

@Repository
public interface ItemElasticRepository extends ElasticsearchRepository<ItemElastic, String> {
    Page<ItemElastic> findByNameOrDescriptionOrCompanyName(String name, String description, String companyName, Pageable pageable);
}
