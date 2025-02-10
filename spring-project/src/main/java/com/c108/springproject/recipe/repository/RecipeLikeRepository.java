package com.c108.springproject.recipe.repository;

import com.c108.springproject.recipe.domain.Recipe;
import com.c108.springproject.recipe.domain.RecipeLike;
import com.c108.springproject.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RecipeLikeRepository extends JpaRepository<RecipeLike, Long> {
    Optional<RecipeLike> findByUserAndRecipe(User user, Recipe recipe);
    boolean existsByUserAndRecipe(User user, Recipe recipe);
    List<RecipeLike> findByUser(User user);
}
