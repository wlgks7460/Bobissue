package com.c108.springproject.answer.domain;

import com.c108.springproject.answer.dto.request.AnswerReqDto;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.question.domain.Question;
import com.c108.springproject.seller.domain.Seller;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Answer extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long answerNo;

    @OneToOne
    @JoinColumn(name = "question_no", nullable = false)
    private Question questionNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller", nullable = false)
    private Seller seller;

    @Column(nullable = false, length = 3000)
    private String content;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;

    public void readAnswer() {
        this.status = "Y";
    }

    public void updateAnswer(AnswerReqDto answerReqDto){
        this.content = answerReqDto.getContent();
    }

}
