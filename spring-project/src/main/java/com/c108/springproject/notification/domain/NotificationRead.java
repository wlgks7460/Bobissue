package com.c108.springproject.notification.domain;

import lombok.Getter;

@Getter
public enum NotificationRead {
    USER("이용자"),
    SELLER("판매자");

    private String value;

    NotificationRead(String value){
        this.value = value;
    }
}
