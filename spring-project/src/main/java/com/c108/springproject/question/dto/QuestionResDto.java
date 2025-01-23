package com.c108.springproject.question.dto;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
public class QuestionResDto {

    private Long questionNo;
    private String title;
    private String content;
    private String category;
    private String itemNo;
    private String isPrivate;
    private String userNo;
}
