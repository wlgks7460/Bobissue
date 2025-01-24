package com.c108.springproject.question.dto.response;

import com.c108.springproject.question.domain.Question;
import com.c108.springproject.question.domain.QuestionCategory;
import lombok.Builder;
import lombok.Data;

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
    private String status;

    public static QuestionResDto toDto(Question question){
        QuestionResDto questionResDto = QuestionResDto.builder()
                .questionNo(question.getQuestionNo())
                .title(question.getTitle())
                .content(question.getContent())
                .category(question.getCategory().toString())
                .itemNo(question.getItemNo())
                .isPrivate(question.getIsPrivate())
                .userNo(question.getUserNo())
                .status(question.getStatus())
                .build();
        return questionResDto;
    }

}
