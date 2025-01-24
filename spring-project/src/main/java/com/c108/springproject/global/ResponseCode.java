package com.c108.springproject.global;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Getter;

@JsonFormat(shape = JsonFormat.Shape.OBJECT)
@Getter
public enum ResponseCode {


    SUCCESS_CREATE_QUESTION("SUCCESS_CREATE_QUESTION","문의글 작성 완료"),
    SUCCESS_CREATE_USER("SUCCESS_CREATE_USER","회원가입 완료"),
    SUCCESS_FOUND_USER_LIST("SUCCESS_FOUND_USER_LIST", "회원 리스트 조회 완료")
    SUCCESS_FIND_ALL_QUESTION("SUCCESS_FIND_ALL_QUESTION", "전체 문의글 조회 완료"),
    SUCCESS_FIND_QUESTION("SUCCESS_FIND_QUESTION", "문의글 조회 완료"),
    QUESTION_NOT_FOUND("QUESTION_NOT_FOUND", "문의글 조회 실패"),
    NOT_FOUND_CATEGORY("NOT_FOUND_CATEGORY", "카테고리 없음"),
    SUCCESS_UPDATE_QUESTION("SUCCESS_UPDATE_QUESTION", "문의글 수정 완료"),
    FAILED_UPDATE_QUESTION("FAILED_UPDATE_QUESTION", "문의글 수정 실패"),
    SUCCESS_DELETE_QUESTION("SUCCESS_DELETE_QUESTION", "문의글 삭제 완료"),

    SUCCESS_CREATE_ITEM("SUCCESS_CREATE_ITEM", "상품 등록 완료"),
    ITEM_NOT_FOUND("ITEM_NOT_FOUND", "아이템 조회 실패"),
    SUCCESS_FIND_ITEM("SUCCESS_FIND_ITEM", "아이템 조회 완료"),
    SUCCESS_UPDATE_ITEM("SUCCESS_UPDATE_ITEM", "아이템 수정 완료"),
    SUCCESS_FIND_CATEGORY("SUCCESS_FIND_CATEGORY", "카테고리 조회 완료"),
    SUCCESS_CREATE_CATEGORY("SUCCESS_CREATE_CATEGORY", "카테고리 생성 완료"),
    SUCCESS_FIND_ALL_CATEGORY("SUCCESS_FIND_ALL_CATEGORY", "전체 카테고리 조회 완료"),
    CATEGORY_NOT_FOUND("CATEGORY_NOT_FOUND", "카테고리 조회 실패"),
    FAILED_DELETE_QUESTION("FAILED_DELETE_QUESTION", "문의글 삭제 실패"),

    ;

    private final String code;
    private final String label;

    ResponseCode(String code, String label) {
        this.code = code;
        this.label = label;
    }

}
