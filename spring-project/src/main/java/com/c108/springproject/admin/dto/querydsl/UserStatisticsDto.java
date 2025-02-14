package com.c108.springproject.admin.dto.querydsl;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatisticsDto {
    private Long totalUsers;            // 총 회원 수
    private Long activeUsers;           // 활성 회원 수
    private Long inactiveUsers;         // 비활성 회원 수
    private Map<String, Long> gender;   // 성별 분포 ('M', 'F')
    private Map<String, Long> ageGroup; // 연령대별 분포 (10대, 20대, ...)
    private Map<String, Long> grade;
}
