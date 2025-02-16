package com.c108.springproject.global.querydsl.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DemographicStatsDto {
    // 연령대별 통계
    private Map<String, AgeGroupStatsDto> ageStats;
    // 성별 통계
    private Map<String, GenderStatsDto> genderStats;
    // 연령대 + 성별 조합 통계
    private Map<String, Map<String, CombinedStatsDto>> combinedStats;
}
