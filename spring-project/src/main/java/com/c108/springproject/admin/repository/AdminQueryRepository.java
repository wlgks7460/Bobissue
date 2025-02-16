package com.c108.springproject.admin.repository;

import com.c108.springproject.admin.dto.querydsl.*;
import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.item.domain.QItemCategory;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.seller.domain.QCompany;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.seller.dto.querydsl.CategorySalesDto;
import com.c108.springproject.seller.dto.querydsl.HourlySalesDto;
import com.c108.springproject.seller.dto.querydsl.MonthlySalesComparisonDto;
import com.c108.springproject.user.domain.QUser;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.NumberExpression;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Repository
public class AdminQueryRepository  extends Querydsl4RepositorySupport {

    QOrder order = QOrder.order;
    QOrderDetail orderDetail = QOrderDetail.orderDetail;
    QItem item = QItem.item;
    QUser user = QUser.user;
    QSeller seller = QSeller.seller;
    QCompany company = QCompany.company;
    QItemCategory itemCategory = QItemCategory.itemCategory;

    protected AdminQueryRepository() {
        super(Order.class);
    }

    // 총 매출 조회
    public Long getTotalSales() {
        return getQueryFactory()
                .select(orderDetail.price.multiply(orderDetail.count).sum().longValue())
                .from(orderDetail)
                .join(orderDetail.order, order)
                .where(
                        order.delYn.eq("N"),
                        order.orderCategoryNo.ne(4)
                )
                .fetchOne();
    }

    // 이용자 통계 (총 회원 | 비활성 | 활성 | 성별 | 연령 | 등급........)

    public UserStatisticsDto getUserStatistics() {
        // 총 회원 수
        Long totalUsers = getQueryFactory()
                .select(user.count())
                .from(user)
                .where(user.delYn.eq("N"))
                .fetchOne();

        // 활성 회원 수
        Long activeUsers = getQueryFactory()
                .select(user.count())
                .from(user)
                .where(
                        user.delYn.eq("N"),
                        user.status.eq("Y")
                )
                .fetchOne();

        // 비활성 회원 수
        Long inactiveUsers = getQueryFactory()
                .select(user.count())
                .from(user)
                .where(
                        user.delYn.eq("N"),
                        user.status.eq("N")
                )
                .fetchOne();

        // 성별 분포
        Map<String, Long> genderDistribution = getQueryFactory()
                .select(user.gender, user.count())
                .from(user)
                .where(user.delYn.eq("N"))
                .groupBy(user.gender)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(user.gender),
                        tuple -> tuple.get(user.count())
                ));

        // 등급별 분포
        Map<String, Long> gradeDistribution = getQueryFactory()
                .select(user.grade, user.count())
                .from(user)
                .where(user.delYn.eq("N"))
                .groupBy(user.grade)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(user.grade).toString(),
                        tuple -> tuple.get(user.count())
                ));

        // 연령대별 분포
        Map<String, Long> ageGroupDistribution = getQueryFactory()
                .select(user.birthday)
                .from(user)
                .where(user.delYn.eq("N"))
                .fetch()
                .stream()
                .collect(Collectors.groupingBy(
                        birthday -> {
                            int birthYear = Integer.parseInt(birthday.substring(0, 4));
                            int age = 2025 - birthYear;
                            if (age < 20) return "10대 이하";
                            else if (age < 30) return "20대";
                            else if (age < 40) return "30대";
                            else if (age < 50) return "40대";
                            else return "50대 이상";
                        },
                        Collectors.counting()
                ));

        return UserStatisticsDto.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .inactiveUsers(inactiveUsers)
                .gender(genderDistribution)
                .ageGroup(ageGroupDistribution)
                .grade(gradeDistribution)
                .build();
    }

    // 회사 통계
    public CompanyStatisticsDto getCompanyStatistics() {
        // 전체 회사 수
        Long totalCompanies = getQueryFactory()
                .select(company.count())
                .from(company)
                .where(company.delYn.eq("N"))
                .fetchOne();

        // 활성 회사 수
        Long activeCompanies = getQueryFactory()
                .select(company.count())
                .from(company)
                .where(
                        company.delYn.eq("N"),
                        company.status.eq("Y")
                )
                .fetchOne();

        // 회사별 총 매출
        List<CompanySalesDto> companySalesStats = getQueryFactory()
                .select(Projections.constructor(CompanySalesDto.class,
                        company.companyNo,
                        company.name,
                        orderDetail.price.multiply(orderDetail.count).sum().longValue()
                ))
                .from(orderDetail)
                .join(orderDetail.item, item)
                .join(item.company, company)
                .where(company.delYn.eq("N"))
                .groupBy(company.companyNo, company.name)
                .fetch();

        // 회사별 월간 매출
        List<CompanyMonthlySalesDto> companyMonthlySales = getQueryFactory()
                .select(Projections.constructor(CompanyMonthlySalesDto.class,
                        company.companyNo,
                        company.name,
                        order.createdAt.substring(0, 6),
                        orderDetail.price.multiply(orderDetail.count).sum().longValue()
                ))
                .from(orderDetail)
                .join(orderDetail.order, order)
                .join(orderDetail.item, item)
                .join(item.company, company)
                .where(company.delYn.eq("N"))
                .groupBy(company.companyNo, company.name, order.createdAt.substring(0, 6))
                .fetch();

        return CompanyStatisticsDto.builder()
                .totalCompanies(totalCompanies)
                .activeCompanies(activeCompanies)
                .companySalesStats(companySalesStats)
                .companyMonthlySales(companyMonthlySales)
                .build();
    }

    // 판매자 통계
    public SellerStatisticsDto getSellerStatistics() {
        // 판매자 상태별 통계
        Map<String, Long> sellerStatusStats = getQueryFactory()
                .select(seller.status, seller.count())
                .from(seller)
                .where(seller.delYn.eq("N"))
                .groupBy(seller.status)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(seller.status),
                        tuple -> tuple.get(seller.count())
                ));

        // 판매 승인 상태별 통계
        Map<String, Long> sellerApprovalStats = getQueryFactory()
                .select(seller.approvalStatus, seller.count())
                .from(seller)
                .where(seller.delYn.eq("N"))
                .groupBy(seller.approvalStatus)
                .fetch()
                .stream()
                .collect(Collectors.toMap(
                        tuple -> tuple.get(seller.approvalStatus),
                        tuple -> tuple.get(seller.count())
                ));

        // 판매자별 총 매출
        List<SellerSalesDto> sellerSalesStats = getQueryFactory()
                .select(Projections.constructor(SellerSalesDto.class,
                        seller.sellerNo,
                        seller.name,
                        company.name,
                        orderDetail.price.multiply(orderDetail.count).sum().longValue()
                ))
                .from(orderDetail)
                .join(orderDetail.item, item)
                .join(item.company, company)
                .join(company.sellers, seller)
                .where(seller.delYn.eq("N"))
                .groupBy(seller.sellerNo, seller.name, company.name)
                .fetch();

        // 월별 판매자 가입 추이
        List<MonthlySellerJoinDto> monthlyJoinStats = getQueryFactory()
                .select(Projections.constructor(MonthlySellerJoinDto.class,
                        seller.createdAt.substring(0, 6),
                        seller.count(),
                        JPAExpressions
                                .select(seller.count())
                                .from(seller)
                                .where(
                                        seller.createdAt.substring(0, 6).eq(seller.createdAt.substring(0, 6)),
                                        seller.approvalStatus.eq("Y")
                                )
                ))
                .from(seller)
                .where(seller.delYn.eq("N"))
                .groupBy(seller.createdAt.substring(0, 6))
                .fetch();

        return SellerStatisticsDto.builder()
                .sellerStatusStats(sellerStatusStats)
                .sellerApprovalStats(sellerApprovalStats)
                .sellerSalesStats(sellerSalesStats)
                .monthlyJoinStats(monthlyJoinStats)
                .build();
    }

    // 전월 대비 실적 분석 (전체)
    public MonthlySalesComparisonDto getTotalMonthlySalesComparison() {
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
                .where(
                        order.delYn.eq("N"),
                        order.createdAt.startsWith(currentMonth)
                )
                .fetchOne();

        // 전월 판매 데이터
        Tuple previousMonthData = getQueryFactory()
                .select(salesAmount, revenueAmount)
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .where(
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

    // 전체 카테고리별 통계
    public List<CategorySalesDto> getTotalCategorySalesStatistics() {
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
                .where(item.delYn.eq("N"))
                .groupBy(itemCategory.categoryNo, itemCategory.name)
                .fetch();
    }

    // 전체 시간대별 판매 분석
    public List<HourlySalesDto> getTotalHourlySalesStatistics() {
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
                    .where(
                            order.delYn.eq("N"),
                            order.createdAt.substring(9, 11).eq(hourStr)
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



}
