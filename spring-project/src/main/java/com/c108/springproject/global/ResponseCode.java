package com.c108.springproject.global;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
public enum ResponseCode {


    SUCCESS_CREATE_QUESTION("SUCCESS_CREATE_QUESTION","문의글 작성 완료"),
    SUCCESS_CREATE_USER("SUCCESS_CREATE_USER","회원가입 완료"),
    SUCCESS_FIND_ALL_QUESTION("SUCCESS_FIND_ALL_QUESTION", "전체 문의글 조회 완료"),
    SUCCESS_FIND_QUESTION("SUCCESS_FIND_QUESTION", "문의글 조회 완료"),
    QUESTION_NOT_FOUND("QUESTION_NOT_FOUND", "문의글 조회 실패")
    ;

    private final String code;
    private final String label;

    ResponseCode(String code, String label) {
        this.code = code;
        this.label = label;
    }

}
