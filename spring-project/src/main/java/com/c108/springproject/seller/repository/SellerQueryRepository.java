package com.c108.springproject.seller.repository;

import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.review.service.ReviewService;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.dto.querydsl.ItemRankingDto;
import com.querydsl.core.types.Projections;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Repository
public class SellerQueryRepository extends Querydsl4RepositorySupport {

    QSeller seller = QSeller.seller;
    QItem item = QItem.item;
    QOrder order = QOrder.order;
    QOrderDetail orderDetail = QOrderDetail.orderDetail;

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
        // 시작 날짜 계산
        String startDate = switch (period) {
            case DAILY -> LocalDateTime.now().minusDays(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            case WEEKLY -> LocalDateTime.now().minusWeeks(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            case MONTHLY -> LocalDateTime.now().minusMonths(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            case YEARLY -> LocalDateTime.now().minusYears(1).format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        };

        // 판매 데이터 조회
        List<ItemRankingDto> rankings = getQueryFactory()
                .select(Projections.constructor(ItemRankingDto.class,
                        item.itemNo,
                        item.name,
                        orderDetail.count.sum().coalesce(0).longValue(),    // 판매량이 없으면 0
                        orderDetail.price.multiply(orderDetail.count).sum().coalesce(0).longValue()  // 매출이 없으면 0
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

        // 평점 정보 추가
        rankings.forEach(rank -> {
            double avgRating = reviewService.getItemAverageRating(rank.getItemNo());
            rank.setAverageRating(avgRating);
        });

        return rankings;


        // 고객만족도
        // (재구매율 | 평점 | 주문취소 | 환불)


        // 전월 대비 실적
        // (판매량 | 매출 | 증감 추이)


        // 판매량 예측 - 전주 얼마나 팔렸는지 집계해서 그거 내가 임의로 다음 주 얼마나 팔릴지 예측해주기


        // 카테고리별 통계


        // 라이브 커머스를 진행했다면 그 시간에 등록한 그 상품이 얼마나 팔렸는지 - 커머스 효율 분석
    }
}