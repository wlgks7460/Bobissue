package com.c108.springproject.global;


import lombok.*;

import java.util.List;

@Getter
@NoArgsConstructor
@ToString(doNotUseGetters = true)
public class DefaultResponse<T> {

    private T data;

    @Builder
    public DefaultResponse(T data){
        this.data = data;
    }

    @Getter
    @NoArgsConstructor(access = AccessLevel.PRIVATE)
    public static class ListResponse<T>{

        private Long count;
        private List<T> data;

        @Builder
        public ListResponse(List<T> list){
            this.count = (long)list.size();
            this.data = list;
        }
    }


    @Getter
    @NoArgsConstructor
    public static class ErrorResponse<T>{

        private T error;

        @Builder
        public ErrorResponse(T error){
            this.error = error;
        }
    }
}
