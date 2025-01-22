package com.c108.springproject.global;


import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class DefaultResponse<T> {

    private T data;

    @Builder
    public DefaultResponse(T data){
        this.data = data;
    }
}
