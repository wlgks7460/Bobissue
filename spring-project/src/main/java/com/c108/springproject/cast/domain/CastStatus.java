package com.c108.springproject.cast.domain;

import lombok.Getter;

@Getter
public enum CastStatus {

    REGISTER("등록"),
    REFUSAL("거절"),
    AWAIT("대기"),
    ONAIR("방송중"),
    TERMINATE("종료");

    private final String value;

    CastStatus(String value){
        this.value = value;
    }

}
