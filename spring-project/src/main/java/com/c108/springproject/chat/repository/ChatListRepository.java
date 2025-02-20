package com.c108.springproject.chat.repository;

import com.c108.springproject.chat.domain.ChatList;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ChatListRepository extends MongoRepository<ChatList, String> {
    Optional<ChatList> findByCastId(int castId);
}
