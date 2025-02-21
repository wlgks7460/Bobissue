package com.c108.springproject.calendar.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.user.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Calendar extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long calendarNo;

    @Column(nullable = false)
    private String name;

    @Builder.Default
    @OneToMany(mappedBy = "calendar", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MealImage> images = new ArrayList<>();

    @Column(nullable = false)
    private String eatDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_no", nullable = false)
    private User user;

    @Column
    private int calorie;

    public void update(String name, String eatDate, int calorie) {
        this.name = name;
        this.eatDate = eatDate;
        this.calorie = calorie;
    }

}
