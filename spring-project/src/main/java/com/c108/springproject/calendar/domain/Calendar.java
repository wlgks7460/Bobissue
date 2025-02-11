package com.c108.springproject.calendar.domain;

import com.c108.springproject.global.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Calendar extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int calendarNo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String eatDate;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "user_no", nullable = false)
//    private User user;
    @Column(nullable = false)
    private int userNo;

    @Column
    private int calorie;


}
