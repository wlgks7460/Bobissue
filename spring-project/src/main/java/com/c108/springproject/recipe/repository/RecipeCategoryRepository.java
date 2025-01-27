package com.c108.springproject.recipe.repository;

import com.c108.springproject.recipe.domain.RecipeCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecipeCategoryRepository extends JpaRepository<RecipeCategory, Integer> {
}
