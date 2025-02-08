package com.c108.springproject.item.repository;

import com.c108.springproject.item.domain.Item;
import com.c108.springproject.item.domain.ItemLike;
import com.c108.springproject.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ItemLikeRepository extends JpaRepository<ItemLike, Long> {
    Optional<ItemLike> findByUserAndItem(User user, Item item);
    boolean existsByUserAndItem(User user, Item item);
    List<ItemLike> findByUser(User user);

}
