package com.c108.springproject.answer.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.question.domain.Question;
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

//    @OneToOne
//    @JoinColumn(name = "seller", nullable = false)
//    private Seller sellerNo;
    @Column(nullable = false)
    private int sellerNo;

    @Column(nullable = false, length = 3000)
    private String content;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;

}
