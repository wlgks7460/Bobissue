package com.c108.springproject.question.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.question.dto.request.QuestionUpdateReqDto;
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
public class Question extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long questionNo;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(length = 2000)
    private String content;

    @Enumerated(EnumType.STRING)
    private QuestionCategory category;

//    @OneToMany
//    @JoinColumn(name = "image_no", nullable = false)
//    private Image imageNo;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "item_no", nullable = false)
//    private Item itemNo;
    @Column(nullable = false)
    private int itemNo;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String isPrivate;

//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private User userNo;
    @Column(nullable = false)
    private int userNo;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;

    public void readQuestion(){
        this.status = "Y";
    }


    public void updateQuestion(QuestionUpdateReqDto questionUpdateReqDto){
        this.title = questionUpdateReqDto.getTitle();
        this.content = questionUpdateReqDto.getContent();
        this.isPrivate = questionUpdateReqDto.getIsPrivate();
        this.category = QuestionCategory.valueOf(questionUpdateReqDto.getCategory());
    }

}
