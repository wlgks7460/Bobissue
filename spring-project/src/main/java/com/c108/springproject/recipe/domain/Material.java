package com.c108.springproject.recipe.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor; // 데이터베이스 테이블에 매핑
import lombok.Builder;
import lombok.Getter; // 모든 필드에 getter 메서드 생성
import lombok.NoArgsConstructor; // 기본 생성자 생성

import java.math.BigInteger;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Material extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int materialNo;

    @Column(nullable = false)
    private int itemNO;

    @Column(nullable = false)
    private int recipeNo;

    @Column(nullable = false)
    private int cnt;
}
