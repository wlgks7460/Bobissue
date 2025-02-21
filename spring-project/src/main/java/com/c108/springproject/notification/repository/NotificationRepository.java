package com.c108.springproject.notification.repository;

import com.c108.springproject.notification.domain.Notification;
import com.c108.springproject.notification.domain.NotificationRead;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    Optional<Notification> findByNoticeNo(int noticeNo);
    List<Notification> findByReader(NotificationRead notificationRead);
}
