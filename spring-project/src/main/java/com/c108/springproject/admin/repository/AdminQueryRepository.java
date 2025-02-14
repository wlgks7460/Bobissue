package com.c108.springproject.admin.repository;

import com.c108.springproject.admin.dto.querydsl.*;
import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.seller.domain.QCompany;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.user.domain.QUser;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.JPAExpressions;
import org.springframework.stereotype.Repository;

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



}
