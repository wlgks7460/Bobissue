package com.c108.springproject.question.dto.request;

import com.c108.springproject.question.domain.QuestionCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionReqDto {

    private String title;
    private String content;
    private String category;
//    private String imageNo;
    private String itemNo;
    private String isPrivate;
//    private User userNo;
    private String status;
    private String createdAt;
    private String updatedAt;
}
