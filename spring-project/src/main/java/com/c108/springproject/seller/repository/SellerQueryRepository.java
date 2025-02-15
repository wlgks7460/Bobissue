package com.c108.springproject.seller.repository;

import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.item.domain.QItemCategory;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.review.domain.QReview;
import com.c108.springproject.review.service.ReviewService;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.querydsl.*;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Expression;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Repository
public class SellerQueryRepository extends Querydsl4RepositorySupport {

    QSeller seller = QSeller.seller;
    QItem item = QItem.item;
    QOrder order = QOrder.order;
    QOrderDetail orderDetail = QOrderDetail.orderDetail;
    QReview review = QReview.review;
    QItemCategory itemCategory = QItemCategory.itemCategory;

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
                        .and(order.createdAt.goe(startDate))
                        .and(order.delYn.eq("N")))
                .where(
                        item.company.companyNo.eq(companyNo),
                        item.delYn.eq("N")
                )
                .groupBy(item.itemNo, item.name)
                .fetch();

        // 각 상품별 추가 통계 데이터 조회
        for (ItemRankingDto ranking : rankings) {
            // 취소 수 조회
            Long cancelCount = getQueryFactory()
                    .select(order.count())
                    .from(orderDetail)
                    .join(order).on(orderDetail.order.eq(order))
                    .where(
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
                                            orderDetail.item.itemNo.eq(ranking.getItemNo()),
                                            order.delYn.eq("N")
                                    )
                    ))
                    .from(order)
                    .join(orderDetail).on(orderDetail.order.eq(order))
                    .where(
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


        // 라이브 커머스를 진행했다면 그 시간에 등록한 그 상품이 얼마나 팔렸는지 - 커머스 효율 분석

}