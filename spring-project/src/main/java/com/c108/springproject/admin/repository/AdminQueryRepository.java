package com.c108.springproject.admin.repository;

import com.c108.springproject.admin.dto.querydsl.UserStatisticsDto;
import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.order.domain.Order;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.seller.domain.QCompany;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.user.domain.QUser;
import org.springframework.stereotype.Repository;

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


}
