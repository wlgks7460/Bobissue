package com.c108.springproject.global;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
public enum ResponseCode {


    SUCCESS_CREATE_QUESTION("SUCCESS_CREATE_QUESTION","문의글 작성 완료"),
    ;

    private final String code;
    private final String message;

    ResponseCode(String code, String message) {
        this.code = code;
        this.message = message;
    }



}
