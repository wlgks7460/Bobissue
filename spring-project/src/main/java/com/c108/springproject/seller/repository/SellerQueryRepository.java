package com.c108.springproject.seller.repository;

import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.seller.domain.Seller;
import org.springframework.stereotype.Repository;

@Repository
public class SellerQueryRepository extends Querydsl4RepositorySupport {

    QSeller seller = QSeller.seller;
    QItem item = QItem.item;
    QOrder order = QOrder.order;
    QOrderDetail orderDetail = QOrderDetail.orderDetail;


    protected SellerQueryRepository() {
        super(Seller.class);
    }

    // 인기판매상품순위 ( 연간 | 월간 | 주간 | 일간 )
    // 정렬 ( 판매상품 개수 순 | 매출 순 | 리뷰 평점 순)


    
    // 고객만족도
    // (재구매율 | 평점 | 주문취소 | 환불)

    
    
    // 전월 대비 실적
    // (판매량 | 매출 | 증감 추이)

    
    
    // 판매량 예측 - 전주 얼마나 팔렸는지 집계해서 그거 내가 임의로 다음 주 얼마나 팔릴지 예측해주기


    
    // 카테고리별 통계



    // 라이브 커머스를 진행했다면 그 시간에 등록한 그 상품이 얼마나 팔렸는지 - 커머스 효율 분석
}
