package com.c108.springproject.question.domain;

import com.c108.springproject.global.entity.BaseEntity;
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

    @Column(nullable = false)
    private String title;

    @Column
    private String content;

    @Column(nullable = false)
    private String category;

//    @OneToMany
//    @JoinColumn(name = "image_no", nullable = false)
//    private Image imageNo;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "item_no", nullable = false)
//    private Item itemNo;
    @Column
    private String itemNo;

    @Column(nullable = false)
    private String isPrivate;

//    @ManyToOne
//    @JoinColumn(name = "user_id", nullable = false)
//    private User userNo;
    @Column
    private String userNo;


    @Column(nullable = false)
    private String status;

}
