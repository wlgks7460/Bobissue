package com.c108.springproject.seller.repository;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.global.querydsl.dto.*;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.item.domain.QItemCategory;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.review.domain.QReview;
import com.c108.springproject.review.service.ReviewService;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.querydsl.*;
import com.c108.springproject.user.domain.QUser;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class SellerQueryRepository extends Querydsl4RepositorySupport {

    QSeller seller = QSeller.seller;
    QItem item = QItem.item;
    QOrder order = QOrder.order;
    QOrderDetail orderDetail = QOrderDetail.orderDetail;
    QReview review = QReview.review;
    QItemCategory itemCategory = QItemCategory.itemCategory;
    QUser user = QUser.user;

    @Autowired
    private ReviewService reviewService;

    protected SellerQueryRepository() {
        super(Seller.class);
    }

    // 인기판매상품순위 ( 연간 | 월간 | 주간 | 일간 )
    // 정렬 ( 판매상품 개수 순 | 매출 순 | 리뷰 평점 순)
    public enum SalesPeriod {
        DAILY, WEEKLY, MONTHLY, YEARLY
    }

    public List<ItemRankingDto> getItemRankings(Integer companyNo, SalesPeriod period) {
        String startDate = switch (period) {
            case DAILY -> LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            case WEEKLY -> LocalDateTime.now().minusWeeks(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            case MONTHLY -> LocalDateTime.now().minusMonths(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            case YEARLY -> LocalDateTime.now().minusYears(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        };

        String endDate = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        System.out.println("Start Date: " + startDate);
        System.out.println("Period: " + period);
        System.out.println("Query parameters - startDate: " + startDate);
        System.out.println("Actual SQL comparison date: " + startDate.substring(0, 8));
        System.out.println("Query parameters - endDate: " + endDate);

        // 기본 판매 데이터 조회
        List<ItemRankingDto> rankings = getQueryFactory()
                .select(Projections.constructor(ItemRankingDto.class,
                        item.itemNo,
                        item.name,
                        orderDetail.count.sum().coalesce(0).longValue(),
                        orderDetail.price.multiply(orderDetail.count).sum().coalesce(0).longValue()
                ))
                .from(item)
                .leftJoin(orderDetail).on(orderDetail.item.eq(item))
                .leftJoin(order).on(orderDetail.order.eq(order)
                        .and(order.createdAt.substring(0, 8).goe(startDate))  // 시작일 이상
                        .and(order.createdAt.substring(0, 8).loe(endDate))   // 종료일 이하
                        .and(order.delYn.eq("N")))
                .where(
                        order.createdAt.substring(0, 8).goe(startDate),
                        order.createdAt.substring(0, 8).loe(endDate),
                        item.company.companyNo.eq(companyNo),
                        item.delYn.eq("N")
                )
                .groupBy(item.itemNo, item.name)
                .fetch();
        System.out.println(rankings.toString());


        // 각 상품별 추가 통계 데이터 조회
        for (ItemRankingDto ranking : rankings) {
            // 취소 수 조회
            Long cancelCount = getQueryFactory()
                    .select(order.count())
                    .from(orderDetail)
                    .join(order).on(orderDetail.order.eq(order))
                    .where(
                            order.createdAt.substring(0, 8).goe(startDate),
                            order.createdAt.substring(0, 8).loe(endDate),
                            orderDetail.item.itemNo.eq(ranking.getItemNo()),
                            order.orderCategoryNo.eq(4),
                            order.delYn.eq("N")
                    )
                    .fetchOne().longValue();

            // 환불 수 조회
            Long refundCount = getQueryFactory()
                    .select(order.count())
                    .from(orderDetail)
                    .join(order).on(orderDetail.order.eq(order))
                    .where(
                            order.createdAt.substring(0, 8).goe(startDate),
                            order.createdAt.substring(0, 8).loe(endDate),
                            orderDetail.item.itemNo.eq(ranking.getItemNo()),
                            order.orderCategoryNo.eq(5),
                            order.delYn.eq("N")
                    )
                    .fetchOne().longValue();

            // 재구매 고객 수 조회 (서브쿼리 사용)
            Long reOrderCount = getQueryFactory()
                    .select(order.count().subtract(
                            JPAExpressions
                                    .select(order.user.countDistinct())
                                    .from(order)
                                    .join(orderDetail).on(orderDetail.order.eq(order))
                                    .where(
                                            order.createdAt.substring(0, 8).goe(startDate),
                                            order.createdAt.substring(0, 8).loe(endDate),
                                            orderDetail.item.itemNo.eq(ranking.getItemNo()),
                                            order.delYn.eq("N")
                                    )
                    ))
                    .from(order)
                    .join(orderDetail).on(orderDetail.order.eq(order))
                    .where(
                            order.createdAt.substring(0, 8).goe(startDate),
                            order.createdAt.substring(0, 8).loe(endDate),
                            orderDetail.item.itemNo.eq(ranking.getItemNo()),
                            order.delYn.eq("N")
                    )
                    .fetchOne().longValue();

            // 평점 정보 추가
            double avgRating = reviewService.getItemAverageRating(ranking.getItemNo());

            // 통계 데이터 설정
            ranking.setStatistics(cancelCount, refundCount, reOrderCount, avgRating);
        }
        return rankings;
    }

    // 고객만족도
    // (재구매율 | 평점 | 주문취소 | 환불)
    public CustomerSatisfactionDto getCustomerSatisfaction(Integer companyNo) {
        // 재구매 고객 수 계산 (2번 이상 구매한 고객)
        Long reOrderCount = getQueryFactory()
                .select(order.user.count())
                .from(order)
                .join(orderDetail).on(orderDetail.order.eq(order))
                .join(orderDetail.item, item)
                .where(
                        item.company.companyNo.eq(companyNo),
                        order.delYn.eq("N")
                )
                .groupBy(order.user)
                .having(order.count().gt(1)


                )
                .fetchCount();

        // 총 구매 고객 수
        Long totalUserCount = getQueryFactory()
                .select(order.user.countDistinct())
                .from(order)
                .join(orderDetail).on(orderDetail.order.eq(order))
                .join(orderDetail.item, item)
                .where(
                        item.company.companyNo.eq(companyNo),
                        order.delYn.eq("N")
                )
                .fetchOne().longValue();

        // 평균 평점
        Double averageRating = getQueryFactory()
                .select(review.rating.avg())
                .from(review)
                .join(review.item, item)
                .where(
                        item.company.companyNo.eq(companyNo),
                        review.delYn.eq("N")
                )
                .fetchOne();

        // 주문취소 수
        Long cancelCount = getQueryFactory()
                .select(order.count())
                .from(order)
                .join(orderDetail).on(orderDetail.order.eq(order))
                .join(orderDetail.item, item)
                .where(
                        item.company.companyNo.eq(companyNo),
                        order.orderCategoryNo.eq(4)  // 주문취소 상태 코드
                )
                .fetchOne().longValue();

        // 환불 수
        Long refundCount = getQueryFactory()
                .select(order.count())
                .from(order)
                .join(orderDetail).on(orderDetail.order.eq(order))
                .join(orderDetail.item, item)
                .where(
                        item.company.companyNo.eq(companyNo),
                        order.orderCategoryNo.eq(5)  // 환불 상태 코드
                )
                .fetchOne().longValue();

        // 전체 주문 수
        Long totalOrders = getQueryFactory()
                .select(order.count())
                .from(order)
                .join(orderDetail).on(orderDetail.order.eq(order))
                .join(orderDetail.item, item)
                .where(
                        item.company.companyNo.eq(companyNo),
                        order.delYn.eq("N")
                )
                .fetchOne().longValue();

        return new CustomerSatisfactionDto(reOrderCount, totalUserCount,
                averageRating, cancelCount, refundCount, totalOrders);
    }

    // 전월 대비 실적 분석
    public MonthlySalesComparisonDto getMonthlySalesComparison(Integer companyNo) {
        // 현재 날짜 기준으로 당월, 전월 시작일 계산
        String currentMonth = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMM"));
        String previousMonth = LocalDateTime.now().minusMonths(1).format(DateTimeFormatter.ofPattern("yyyyMM"));

        // 당월 판매 데이터
        NumberExpression<Long> salesAmount = orderDetail.count();
        NumberExpression<Long> revenueAmount = orderDetail.price.multiply(orderDetail.count).sum().longValue();

        Tuple currentMonthData = getQueryFactory()
                .select(salesAmount, revenueAmount)
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(item).on(orderDetail.item.eq(item))
                .where(
                        item.company.companyNo.eq(Expressions.constant(companyNo)),  // 수정된 부분
                        order.delYn.eq("N"),
                        order.createdAt.startsWith(currentMonth)
                )
                .fetchOne();

        // 전월 판매 데이터
        Tuple previousMonthData = getQueryFactory()
                .select(salesAmount, revenueAmount)
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(item).on(orderDetail.item.eq(item))
                .where(
                        item.company.companyNo.eq(Expressions.constant(companyNo)),  // 수정된 부분
                        order.delYn.eq("N"),
                        order.createdAt.startsWith(previousMonth)
                )
                .fetchOne();

        // DTO 생성 및 데이터 설정
        MonthlySalesComparisonDto comparison = new MonthlySalesComparisonDto();


    // 당월 데이터 설정 (null 체크 포함)
        comparison.setCurrentMonthSales(currentMonthData != null && currentMonthData.get(salesAmount) != null
                ? currentMonthData.get(salesAmount) : 0L);
        comparison.setCurrentMonthRevenue(currentMonthData != null && currentMonthData.get(revenueAmount) != null
                ? currentMonthData.get(revenueAmount) : 0L);

    // 전월 데이터 설정 (null 체크 포함)
        comparison.setPreviousMonthSales(previousMonthData != null && previousMonthData.get(salesAmount) != null
                ? previousMonthData.get(salesAmount) : 0L);
        comparison.setPreviousMonthRevenue(previousMonthData != null && previousMonthData.get(revenueAmount) != null
                ? previousMonthData.get(revenueAmount) : 0L);

        // 증감률 계산
        comparison.calculateGrowthRates();

        return comparison;
    }

    // 데이터 넣어보고 다시 확인 필요
    public SalesPredictionDto getSalesPrediction(Integer companyNo) {
        List<Long> weeklySales = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();

        // 최근 3주간의 주간 판매량 조회
        for (int i = 1; i <= 3; i++) {
            LocalDateTime weekStart = now.minusWeeks(i).with(DayOfWeek.MONDAY);
            LocalDateTime weekEnd = weekStart.plusDays(6);

            String weekStartStr = weekStart.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String weekEndStr = weekEnd.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            Long weekSales = getQueryFactory()
                    .select(orderDetail.count())
                    .from(orderDetail)
                    .join(order).on(orderDetail.order.eq(order))
                    .join(item).on(orderDetail.item.eq(item))
                    .where(
                            item.company.companyNo.eq(Expressions.constant(companyNo)),
                            order.delYn.eq("N"),
                            order.createdAt.between(weekStartStr, weekEndStr)
                    )
                    .fetchOne();

            weeklySales.add(weekSales != null ? weekSales : 0L);
        }

        // 다음 주 판매량 예측 (3주 이동평균)
        long predictedSales = Math.round(weeklySales.stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0.0));

        // 신뢰도 계산 (데이터가 없는 경우 처리 추가)
        double confidenceRate = 0.0;
        if (predictedSales > 0) {
            double stdDev = calculateStandardDeviation(weeklySales);
            confidenceRate = 100 - (stdDev / predictedSales * 100);
            confidenceRate = Math.max(0, Math.min(100, confidenceRate));
        }

        return SalesPredictionDto.builder()
                .predictedSales(predictedSales)
                .confidenceRate(confidenceRate)  // NaN 대신 0.0 반환
                .previousWeekSales(weeklySales.get(0))
                .twoWeeksAgoSales(weeklySales.get(1))
                .threeWeeksAgoSales(weeklySales.get(2))
                .build();
    }

    // 표준편차 계산 메서드 개선
    private double calculateStandardDeviation(List<Long> values) {
        if (values.stream().allMatch(val -> val == 0)) {
            return 0.0;  // 모든 값이 0인 경우
        }

        double mean = values.stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0.0);

        if (mean == 0.0) {
            return 0.0;
        }

        double variance = values.stream()
                .mapToDouble(val -> Math.pow(val - mean, 2))
                .average()
                .orElse(0.0);

        return Math.sqrt(variance);
    }


    // 카테고리별 통계
// 카테고리별 통계
    public List<CategorySalesDto> getCategorySalesStatistics(Integer companyNo) {
        return getQueryFactory()
                .select(Projections.constructor(CategorySalesDto.class,
                        itemCategory.categoryNo,
                        itemCategory.name,
                        orderDetail.count().coalesce(0L),
                        orderDetail.price.multiply(orderDetail.count).sum().coalesce(0).longValue(),
                        item.countDistinct().intValue(),
                        item.price.avg().coalesce(0.0)
                ))
                .from(itemCategory)
                .leftJoin(item).on(itemCategory.categoryNo.eq(item.category.categoryNo))
                .leftJoin(orderDetail).on(orderDetail.item.eq(item))
                .leftJoin(order).on(orderDetail.order.eq(order)
                        .and(order.delYn.eq("N")))
                .where(
                        item.company.companyNo.eq(Expressions.constant(companyNo)),
                        item.delYn.eq("N")
                )
                .groupBy(itemCategory.categoryNo, itemCategory.name)
                .fetch();
    }


    // 시간대별 판매 분석
    public List<HourlySalesDto> getHourlySalesStatistics(Integer companyNo) {
        List<HourlySalesDto> hourlyStats = new ArrayList<>();

        // 각 시간대(0-23)별로 통계 계산
        for (int hour = 0; hour < 24; hour++) {
            final String hourStr = String.format("%02d", hour);

            Tuple hourData = getQueryFactory()
                    .select(
                            order.count(),
                            orderDetail.price.multiply(orderDetail.count).sum().coalesce(0).longValue()
                    )
                    .from(orderDetail)
                    .join(order).on(orderDetail.order.eq(order))
                    .join(item).on(orderDetail.item.eq(item))
                    .where(
                            item.company.companyNo.eq(Expressions.constant(companyNo)),
                            order.delYn.eq("N"),
                            order.createdAt.substring(9, 11).eq(hourStr)  // 수정된 부분
                    )
                    .fetchOne();

            HourlySalesDto hourlyDto = new HourlySalesDto();
            hourlyDto.setHour(hour);
            hourlyDto.setSalesCount(hourData.get(0, Long.class));
            hourlyDto.setTotalRevenue(hourData.get(1, Long.class));
            hourlyDto.calculateAverageOrderAmount();

            hourlyStats.add(hourlyDto);
        }

        return hourlyStats;
    }
    
    // 성별/ 연령 통계
    public DemographicStatsDto getDemographicStats(Integer companyNo) {
        try {
            // 연령대 그룹핑 표현식
            StringExpression ageGroup = Expressions.stringTemplate(
                    "CASE " +
                            "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 19 THEN '20대 미만' " +
                            "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 29 THEN '20대' " +
                            "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 39 THEN '30대' " +
                            "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 49 THEN '40대' " +
                            "ELSE '50대 이상' END",
                    user.birthday
            );

            try {
                // 연령대별 통계
                Map<String, AgeGroupStatsDto> ageStats = getQueryFactory()
                        .select(Projections.fields(AgeGroupStatsDto.class,
                                ageGroup.as("ageGroup"),
                                order.count().longValue().as("totalOrders"),
                                orderDetail.price.multiply(orderDetail.count).sum().longValue().as("totalRevenue"),
                                orderDetail.price.multiply(orderDetail.count).avg().doubleValue().as("averageOrderAmount")
                        ))
                        .from(orderDetail)
                        .join(order).on(orderDetail.order.eq(order))
                        .join(order.user, user)
                        .join(orderDetail.item, item)
                        .where(
                                item.company.companyNo.eq(Expressions.constant(companyNo)),
                                order.delYn.eq("N")
                        )
                        .groupBy(ageGroup)
                        .fetch()
                        .stream()
                        .collect(Collectors.toMap(
                                AgeGroupStatsDto::getAgeGroup,
                                stats -> stats
                        ));

                // 연령대별 선호 카테고리 추가
                for (String age : ageStats.keySet()) {
                    List<CategoryPreferenceDto> topCategories = getQueryFactory()
                            .select(Projections.fields(CategoryPreferenceDto.class,
                                    itemCategory.categoryNo.as("categoryNo"),
                                    itemCategory.name.as("categoryName"),
                                    order.count().longValue().as("orderCount"),
                                    orderDetail.price.multiply(orderDetail.count).sum().longValue().as("totalRevenue")
                            ))
                            .from(orderDetail)
                            .join(order).on(orderDetail.order.eq(order))
                            .join(order.user, user)
                            .join(orderDetail.item, item)
                            .join(item.category, itemCategory)
                            .where(
                                    item.company.companyNo.eq(Expressions.constant(companyNo)),
                                    order.delYn.eq("N"),
                                    ageGroup.eq(age)
                            )
                            .groupBy(itemCategory.categoryNo, itemCategory.name)
                            .orderBy(order.count().desc())
                            .limit(5)
                            .fetch();

                    ageStats.get(age).setTopCategories(topCategories);
                }

                // 성별 통계
                Map<String, GenderStatsDto> genderStats = getQueryFactory()
                        .select(Projections.fields(GenderStatsDto.class,
                                user.gender.as("gender"),
                                order.count().longValue().as("totalOrders"),
                                orderDetail.price.multiply(orderDetail.count).sum().longValue().as("totalRevenue"),
                                orderDetail.price.multiply(orderDetail.count).avg().doubleValue().as("averageOrderAmount")
                        ))
                        .from(orderDetail)
                        .join(order).on(orderDetail.order.eq(order))
                        .join(order.user, user)
                        .join(orderDetail.item, item)
                        .where(
                                item.company.companyNo.eq(Expressions.constant(companyNo)),
                                order.delYn.eq("N")
                        )
                        .groupBy(user.gender)
                        .fetch()
                        .stream()
                        .collect(Collectors.toMap(
                                GenderStatsDto::getGender,
                                stats -> stats
                        ));

                // 성별 선호 카테고리 추가
                for (String gender : genderStats.keySet()) {
                    List<CategoryPreferenceDto> topCategories = getQueryFactory()
                            .select(Projections.fields(CategoryPreferenceDto.class,
                                    itemCategory.categoryNo.as("categoryNo"),
                                    itemCategory.name.as("categoryName"),
                                    order.count().longValue().as("orderCount"),
                                    orderDetail.price.multiply(orderDetail.count).sum().longValue().as("totalRevenue")
                            ))
                            .from(orderDetail)
                            .join(order).on(orderDetail.order.eq(order))
                            .join(order.user, user)
                            .join(orderDetail.item, item)
                            .join(item.category, itemCategory)
                            .where(
                                    item.company.companyNo.eq(Expressions.constant(companyNo)),
                                    order.delYn.eq("N"),
                                    user.gender.eq(gender)
                            )
                            .groupBy(itemCategory.categoryNo, itemCategory.name)
                            .orderBy(order.count().desc())
                            .limit(5)
                            .fetch();

                    genderStats.get(gender).setTopCategories(topCategories);
                }

                // 연령대 + 성별 조합 통계
                Map<String, Map<String, CombinedStatsDto>> combinedStats = new HashMap<>();

                List<Tuple> combinedResults = getQueryFactory()
                        .select(
                                ageGroup,
                                user.gender,
                                order.count().longValue(),
                                orderDetail.price.multiply(orderDetail.count).sum().longValue(),
                                orderDetail.price.multiply(orderDetail.count).avg().doubleValue()
                        )
                        .from(orderDetail)
                        .join(order).on(orderDetail.order.eq(order))
                        .join(order.user, user)
                        .join(orderDetail.item, item)
                        .where(
                                item.company.companyNo.eq(Expressions.constant(companyNo)),
                                order.delYn.eq("N")
                        )
                        .groupBy(ageGroup, user.gender)
                        .fetch();

                for (Tuple result : combinedResults) {
                    String age = result.get(ageGroup);
                    String gender = result.get(user.gender);

                    CombinedStatsDto stats = CombinedStatsDto.builder()
                            .totalOrders(result.get(2, Long.class))
                            .totalRevenue(result.get(3, Long.class))
                            .averageOrderAmount(result.get(4, Double.class))
                            .build();

                    // 연령대 + 성별 조합별 선호 카테고리
                    List<CategoryPreferenceDto> topCategories = getQueryFactory()
                            .select(Projections.fields(CategoryPreferenceDto.class,
                                    itemCategory.categoryNo.as("categoryNo"),
                                    itemCategory.name.as("categoryName"),
                                    order.count().longValue().as("orderCount"),
                                    orderDetail.price.multiply(orderDetail.count).sum().longValue().as("totalRevenue")
                            ))
                            .from(orderDetail)
                            .join(order).on(orderDetail.order.eq(order))
                            .join(order.user, user)
                            .join(orderDetail.item, item)
                            .join(item.category, itemCategory)
                            .where(
                                    item.company.companyNo.eq(Expressions.constant(companyNo)),
                                    order.delYn.eq("N"),
                                    ageGroup.eq(age),
                                    user.gender.eq(gender)
                            )
                            .groupBy(itemCategory.categoryNo, itemCategory.name)
                            .orderBy(order.count().desc())
                            .limit(5)
                            .fetch();

                    stats.setTopCategories(topCategories);
                    combinedStats.computeIfAbsent(age, k -> new HashMap<>()).put(gender, stats);
                }

                return DemographicStatsDto.builder()
                        .ageStats(ageStats)
                        .genderStats(genderStats)
                        .combinedStats(combinedStats)
                        .build();

            } catch (Exception e) {
                System.out.println("Inner Query Error: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }
        } catch (Exception e) {
            System.out.println("Outer Error: " + e.getMessage());
            e.printStackTrace();
            throw new BobIssueException(ResponseCode.FAILED_GET_DEMOGRAPHIC_STATS);
        }
    }

    // TOP10 상품

}