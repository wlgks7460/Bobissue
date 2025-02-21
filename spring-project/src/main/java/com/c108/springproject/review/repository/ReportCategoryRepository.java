package com.c108.springproject.review.repository;

import com.c108.springproject.review.domain.ReportCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportCategoryRepository extends JpaRepository<ReportCategory, Integer> {
}
