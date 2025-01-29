package com.c108.springproject.seller.domain;

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
public class Company extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int companyNo;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String license;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;


}
