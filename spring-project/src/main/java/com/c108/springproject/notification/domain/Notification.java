package com.c108.springproject.notification.domain;

import com.c108.springproject.admin.domain.Admin;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.notification.dto.request.NotificationReqDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int noticeNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_no", nullable = false)
    private Admin admin;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    @Enumerated(EnumType.STRING)
    private NotificationRead reader;

    public void updateNotification(NotificationReqDto notificationReqDto){
        this.title = notificationReqDto.getTitle();
        this.content = notificationReqDto.getContent();
        this.reader = NotificationRead.valueOf(notificationReqDto.getReader());
    }


}
