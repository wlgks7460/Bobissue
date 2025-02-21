package com.c108.springproject.item.repository;

import com.c108.springproject.global.querydsl.Querydsl4RepositorySupport;
import com.c108.springproject.item.domain.QItem;
import com.c108.springproject.item.domain.QItemCategory;
import com.c108.springproject.item.dto.querydsl.*;
import com.c108.springproject.order.domain.QOrder;
import com.c108.springproject.order.domain.QOrderDetail;
import com.c108.springproject.recipe.domain.QMaterial;
import com.c108.springproject.recipe.domain.QRecipe;
import com.c108.springproject.review.domain.QReview;
import com.c108.springproject.seller.domain.QSeller;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.user.domain.QUser;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.ExpressionUtils;
import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.StringExpression;
import com.querydsl.jpa.JPAExpressions;
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
    QRecipe recipe = QRecipe.recipe;
    QMaterial material = QMaterial.material;


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

    // 모든 성별 구매 통계
    public List<ItemGenderStatsDto> getItemsByGenderPreference() {
        return getQueryFactory()
                .select(Projections.fields(ItemGenderStatsDto.class,
                        item.itemNo.as("itemNo"),
                        item.name.as("itemName"),
                        item.price.as("price"),
                        orderDetail.count().longValue().as("totalSales"),
                        Expressions.as(
                                JPAExpressions.select(orderDetail.count())
                                        .from(orderDetail)
                                        .join(orderDetail.order, order)
                                        .join(order.user, user)
                                        .where(
                                                order.delYn.eq("N"),
                                                orderDetail.item.eq(item),
                                                user.gender.eq("M")
                                        ),
                                "maleSales"
                        ),
                        Expressions.as(
                                JPAExpressions.select(orderDetail.count())
                                        .from(orderDetail)
                                        .join(orderDetail.order, order)
                                        .join(order.user, user)
                                        .where(
                                                order.delYn.eq("N"),
                                                orderDetail.item.eq(item),
                                                user.gender.eq("F")
                                        ),
                                "femaleSales"
                        ),
                        ExpressionUtils.as(
                                Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'M' THEN 1 ELSE 0 END) AS double) / COUNT(*) * 100",
                                        user.gender),
                                "malePercentage"
                        ),
                        ExpressionUtils.as(
                                Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'F' THEN 1 ELSE 0 END) AS double) / COUNT(*) * 100",
                                        user.gender),
                                "femalePercentage"
                        )
                ))
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(order.user, user)
                .join(orderDetail.item, item)
                .where(
                        order.delYn.eq("N"),
                        item.delYn.eq("N")
                )
                .groupBy(item.itemNo, item.name, item.price)
                .having(orderDetail.count().goe(10))  // 최소 10회 이상 판매된 상품만
                .fetch();
    }


    // 여자
    public List<ItemGenderStatsDto> getFemalePreferredItems() {
        return getQueryFactory()
                .select(Projections.fields(ItemGenderStatsDto.class,
                        item.itemNo.as("itemNo"),
                        item.name.as("itemName"),
                        item.price.as("price"),
                        orderDetail.count().longValue().as("totalSales"),
                        Expressions.as(
                                JPAExpressions.select(orderDetail.count())
                                        .from(orderDetail)
                                        .join(orderDetail.order, order)
                                        .join(order.user, user)
                                        .where(
                                                order.delYn.eq("N"),
                                                orderDetail.item.eq(item),
                                                user.gender.eq("M")
                                        ),
                                "maleSales"
                        ),
                        Expressions.as(
                                JPAExpressions.select(orderDetail.count())
                                        .from(orderDetail)
                                        .join(orderDetail.order, order)
                                        .join(order.user, user)
                                        .where(
                                                order.delYn.eq("N"),
                                                orderDetail.item.eq(item),
                                                user.gender.eq("F")
                                        ),
                                "femaleSales"
                        ),
                        ExpressionUtils.as(
                                Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'M' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0) * 100",
                                        user.gender),
                                "malePercentage"
                        ),
                        ExpressionUtils.as(
                                Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'F' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0) * 100",
                                        user.gender),
                                "femalePercentage"
                        )
                ))
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(order.user, user)
                .join(orderDetail.item, item)
                .where(
                        order.delYn.eq("N"),
                        item.delYn.eq("N")
                )
                .groupBy(item.itemNo, item.name, item.price, user.gender)
                .having(
                        orderDetail.count().goe(10)
                                .and(Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'F' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0)",
                                        user.gender).gt(0.6))
                )
                .orderBy(Expressions.numberTemplate(Double.class,
                        "CAST(SUM(CASE WHEN {0} = 'F' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0)",
                        user.gender).desc())
                .limit(10)
                .fetch();
    }

    // 남자
    public List<ItemGenderStatsDto> getMalePreferredItems() {
        return getQueryFactory()
                .select(Projections.fields(ItemGenderStatsDto.class,
                        item.itemNo.as("itemNo"),
                        item.name.as("itemName"),
                        item.price.as("price"),
                        orderDetail.count().longValue().as("totalSales"),
                        Expressions.as(
                                JPAExpressions.select(orderDetail.count())
                                        .from(orderDetail)
                                        .join(orderDetail.order, order)
                                        .join(order.user, user)
                                        .where(
                                                order.delYn.eq("N"),
                                                orderDetail.item.eq(item),
                                                user.gender.eq("M")
                                        ),
                                "maleSales"
                        ),
                        Expressions.as(
                                JPAExpressions.select(orderDetail.count())
                                        .from(orderDetail)
                                        .join(orderDetail.order, order)
                                        .join(order.user, user)
                                        .where(
                                                order.delYn.eq("N"),
                                                orderDetail.item.eq(item),
                                                user.gender.eq("F")
                                        ),
                                "femaleSales"
                        ),
                        ExpressionUtils.as(
                                Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'M' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0) * 100",
                                        user.gender),
                                "malePercentage"
                        ),
                        ExpressionUtils.as(
                                Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'F' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0) * 100",
                                        user.gender),
                                "femalePercentage"
                        )
                ))
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(order.user, user)
                .join(orderDetail.item, item)
                .where(
                        order.delYn.eq("N"),
                        item.delYn.eq("N")
                )
                .groupBy(item.itemNo, item.name, item.price, user.gender)
                .having(
                        orderDetail.count().goe(10)
                                .and(Expressions.numberTemplate(Double.class,
                                        "CAST(SUM(CASE WHEN {0} = 'M' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0)",
                                        user.gender).gt(0.6))
                )
                .orderBy(Expressions.numberTemplate(Double.class,
                        "CAST(SUM(CASE WHEN {0} = 'M' THEN 1 ELSE 0 END) AS double) / NULLIF(COUNT(*), 0)",
                        user.gender).desc())
                .limit(10)
                .fetch();
    }

    // 많이 팔린 제품 TOP10
    public List<ItemBestSellerDto> getBestSellerItems() {
        return getQueryFactory()
                .select(Projections.fields(ItemBestSellerDto.class,
                        item.itemNo.as("itemNo"),
                        item.name.as("itemName"),
                        item.price.as("price"),
                        orderDetail.count().longValue().as("totalSales"),
                        orderDetail.price.multiply(orderDetail.count).sum().longValue().as("totalRevenue"),
                        review.rating.avg().as("averageRating")
                ))
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(orderDetail.item, item)
                .leftJoin(review).on(review.item.eq(item).and(review.delYn.eq("N")))
                .where(
                        order.delYn.eq("N"),
                        item.delYn.eq("N")
                )
                .groupBy(item.itemNo, item.name, item.price)
                .orderBy(orderDetail.count().desc())
                .limit(10)
                .fetch();
    }
    // 이 제품을 구매한 사용자들이 구매한 다른 상품 5개 추천 없으면 비슷한 카테고리 5개 추천
    // 카테고리 + 성별/연령대 기반 추천
    public List<ItemRecommendationDto> getRecommendationsByCategoryAndDemographic(Integer itemNo) {
        // 연령대 표현식
        StringExpression ageGroupExpr = Expressions.stringTemplate(
                "CASE " +
                        "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 19 THEN '20대 미만' " +
                        "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 29 THEN '20대' " +
                        "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 39 THEN '30대' " +
                        "WHEN (2025 - CAST(SUBSTRING({0}, 1, 4) AS INTEGER)) <= 49 THEN '40대' " +
                        "ELSE '50대 이상' END",
                user.birthday
        );

        // 해당 상품의 주요 구매자 그룹 찾기 (서브쿼리로 처리)
        Tuple popularGroup = getQueryFactory()
                .select(
                        user.gender,
                        ageGroupExpr
                )
                .from(orderDetail)
                .join(order).on(orderDetail.order.eq(order))
                .join(order.user, user)
                .where(
                        orderDetail.item.itemNo.eq(itemNo),
                        order.delYn.eq("N")
                )
                .groupBy(user.gender, ageGroupExpr)
                .having(orderDetail.count().gt(0))
                .orderBy(orderDetail.count().desc())
                .fetchFirst();

        // 구매 이력이 없는 경우 카테고리 기반으로만 추천
        if (popularGroup == null) {
            return getQueryFactory()
                    .select(Projections.fields(ItemRecommendationDto.class,
                            item.itemNo.as("itemNo"),
                            item.name.as("itemName"),
                            item.price.as("price"),
                            Expressions.as(
                                    JPAExpressions.select(orderDetail.count())
                                            .from(orderDetail)
                                            .join(orderDetail.order, order)
                                            .where(
                                                    order.delYn.eq("N"),
                                                    orderDetail.item.eq(item)
                                            ),
                                    "totalSales"
                            ),
                            Expressions.as(
                                    JPAExpressions.select(review.rating.avg())
                                            .from(review)
                                            .where(
                                                    review.item.eq(item),
                                                    review.delYn.eq("N")
                                            ),
                                    "averageRating"
                            )
                    ))
                    .from(item)
                    .where(
                            item.delYn.eq("N"),
                            item.category.categoryNo.eq(
                                    JPAExpressions.select(item.category.categoryNo)
                                            .from(item)
                                            .where(item.itemNo.eq(itemNo))
                            ),
                            item.itemNo.ne(itemNo)
                    )
                    .orderBy(item.itemNo.asc())
                    .limit(5)
                    .fetch();
        }

        // 찾은 그룹 정보로 추천 상품 조회
        return getQueryFactory()
                .select(Projections.fields(ItemRecommendationDto.class,
                        item.itemNo.as("itemNo"),
                        item.name.as("itemName"),
                        item.price.as("price"),
                        Expressions.as(
                                JPAExpressions.select(orderDetail.count())
                                        .from(orderDetail)
                                        .join(orderDetail.order, order)
                                        .where(
                                                order.delYn.eq("N"),
                                                orderDetail.item.eq(item)
                                        ),
                                "totalSales"
                        ),
                        Expressions.as(
                                JPAExpressions.select(review.rating.avg())
                                        .from(review)
                                        .where(
                                                review.item.eq(item),
                                                review.delYn.eq("N")
                                        ),
                                "averageRating"
                        )
                ))
                .from(item)
                .join(orderDetail).on(orderDetail.item.eq(item))
                .join(order).on(orderDetail.order.eq(order))
                .join(order.user, user)
                .where(
                        item.delYn.eq("N"),
                        order.delYn.eq("N"),
                        item.category.categoryNo.eq(
                                JPAExpressions.select(item.category.categoryNo)
                                        .from(item)
                                        .where(item.itemNo.eq(itemNo))
                        ),
                        item.itemNo.ne(itemNo),
                        user.gender.eq(popularGroup.get(user.gender)),
                        ageGroupExpr.eq(popularGroup.get(ageGroupExpr))
                )
                .groupBy(item.itemNo, item.name, item.price)
                .orderBy(orderDetail.count().desc())
                .limit(5)
                .fetch();
    }

    // 구매 이력 기반 협업 필터링
    public List<ItemRecommendationDto> getRecommendationsByCollaborativeFiltering(Integer itemNo) {
        return getQueryFactory()
                .select(Projections.fields(ItemRecommendationDto.class,
                        item.itemNo.as("itemNo"),
                        item.name.as("itemName"),
                        item.price.as("price"),
                        orderDetail.count().longValue().as("totalSales"),
                        review.rating.avg().as("averageRating")
                ))
                .from(item)
                .join(orderDetail).on(orderDetail.item.eq(item))
                .join(order).on(orderDetail.order.eq(order))
                .join(review).on(review.item.eq(item))
                .where(
                        item.delYn.eq("N"),
                        order.delYn.eq("N"),
                        order.user.in(
                                JPAExpressions.select(order.user)
                                        .from(orderDetail)
                                        .join(order).on(orderDetail.order.eq(order))
                                        .where(orderDetail.item.itemNo.eq(itemNo))
                        ),
                        item.itemNo.ne(itemNo)
                )
                .groupBy(item.itemNo, item.name, item.price)
                .orderBy(orderDetail.count().desc())
                .limit(5)
                .fetch();
    }

    // 레시피 기반 추천
    public List<RecipeRecommendationDto> getRecommendationsByRecipe(Integer itemNo) {
        return getQueryFactory()
                .select(Projections.fields(RecipeRecommendationDto.class,
                        recipe.recipeNo.as("recipeNo"),
                        recipe.name.as("recipeName"),
                        recipe.description.as("recipeDescription"),
                        recipe.time.as("cookingTime")
                ))
                .from(recipe)
                .join(material).on(material.recipe.eq(recipe))
                .where(
                        material.item.itemNo.eq(itemNo)
                )
                .orderBy(recipe.recipeNo.desc())  // 최신 레시피 우선
                .limit(5)
                .fetch();
    }
}
