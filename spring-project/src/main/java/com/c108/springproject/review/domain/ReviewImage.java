package com.c108.springproject.review.domain;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Table(name = "reviewimage")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewImage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long imageNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_no")
    @JsonIgnore
    private Review review;

    @Column(nullable = false, length = 255)
    private String originalName;

    @Column(nullable = false, length = 255)
    private String imageUrl;
}
