package com.c108.springproject.admin.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminBank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int BankNo;

    @Setter
    @Column(nullable = false)
    private long bankBalance;
}
