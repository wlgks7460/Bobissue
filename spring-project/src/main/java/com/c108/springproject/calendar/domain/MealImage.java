package com.c108.springproject.calendar.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "mealimage")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealImage extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long imageNo;

    @ManyToOne(fetch = FetchType.LAZY) // 이거 OneToOne 이랑 OneToMany 연결되어서 빨간 줄
    @JoinColumn(name = "calendar_no")
    @JsonIgnore
    private Calendar calendar;

    @Column(nullable = false, length = 255)
    private String originalName;

    @Column(nullable = false, length = 255)
    private String imageUrl;
}
