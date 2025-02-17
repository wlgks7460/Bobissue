package com.c108.springproject.item.repository;

import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.item.domain.QItemCategory;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.review.domain.QReview;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.user.domain.QUser;
import com.c108.springproject.item.repository.querydsl.ItemRepurchaseDto;
import com.querydsl.core.types.Projections;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ItemQueryRepository extends Querydsl4RepositorySupport {

    QSeller seller = QSeller.seller;
    QItem item = QItem.item;
    QOrder order = QOrder.order;
    QOrderDetail orderDetail = QOrderDetail.orderDetail;
    QReview review = QReview.review;
    QItemCategory itemCategory = QItemCategory.itemCategory;
    QUser user = QUser.user;


    protected ItemQueryRepository() {
        super(Seller.class);
    }


    // 재구매율 높은 10개 제품
    public List<ItemRepurchaseDto> getTopRepurchaseItems() {

        return getQueryFactory()
                .select(Projections.fields(ItemRepurchaseDto.class,
                        item.itemNo.as("itemNo"),
                        item.name.as("itemName"),
                        item.price.as("price"),
                        order.user.countDistinct().longValue().as("uniqueUserCount"),
                        order.count().longValue().as("totalOrders"),
                        orderDetail.count().divide(order.user.countDistinct().castToNum(Double.class)).as("repurchaseRate")
                ))
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(orderDetail.item, item)
                .where(
                        order.delYn.eq("N"),
                        item.delYn.eq("N")
                )
                .groupBy(item.itemNo, item.name, item.price)
                .having(order.user.countDistinct().gt(0))  // 최소 1명 이상의 구매자
                .orderBy(orderDetail.count().divide(order.user.countDistinct().castToNum(Double.class)).desc())
                .limit(10)
                .fetch();
    }


    // 많이 팔린 제품

    // 여성이 많이 구매한 제품

    // 남성이 많이 구매한 제품

    // 이 제품을 구매한 사용자들이 구매한 다른 상품
}
