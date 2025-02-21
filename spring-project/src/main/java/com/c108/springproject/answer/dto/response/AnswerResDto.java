package com.c108.springproject.answer.dto.response;


import com.c108.springproject.answer.domain.Answer;
import com.c108.springproject.question.domain.Question;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnswerResDto {

    private Long answerNo;
    private String content;
    private int sellerNo;
    private Long questionNo;
    private String status;
    private String createAt;
    private String createdUser;
    private String updatedAt;
    private String updatedUser;
    private String delYN;

    public static AnswerResDto toDto(Answer answer){
        return AnswerResDto.builder()
                .answerNo(answer.getAnswerNo())
                .content(answer.getContent())
                .sellerNo(answer.getSeller().getSellerNo())
                .questionNo(answer.getQuestionNo().getQuestionNo())
                .status(answer.getStatus())
                .createAt(answer.getCreatedAt())
                .createdUser(answer.getCreatedUser())
                .updatedAt(answer.getUpdatedAt())
                .updatedUser(answer.getUpdatedUser())
                .delYN(answer.getDelYn())
                .build();
    }

}
