package com.c108.springproject.question.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionUpdateReqDto {

    private String title;
    private String content;
    private String isPrivate;
    private String category;
}
