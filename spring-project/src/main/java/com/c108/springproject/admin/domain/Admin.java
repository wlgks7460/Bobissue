package com.c108.springproject.admin.domain;

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
public class Admin  {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int adminNo;

    @Column(nullable = false, unique = true)
    private String adminId;

    @Column(nullable = false)
    private String adminPassword;

    @Column(nullable = false, length = 15)
    private String createdAt;

    @Column(nullable = false, length = 15)
    private String updatedAt;


}
