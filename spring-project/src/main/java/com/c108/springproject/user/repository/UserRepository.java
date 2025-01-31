package com.c108.springproject.user.repository;

import com.c108.springproject.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    @Query("SELECT u FROM User u WHERE u.delYn = 'N'")
    List<User> findAllActiveUsers();

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = CASE WHEN u.status = 'Y' THEN 'N' ELSE 'Y' END WHERE u.userNo = :userNo")
    void changeUserStatus(int userNo);

    @Query("SELECT u.status FROM User u WHERE u.userNo = :userNo")
    String findUserStatus(int userNo);

}