package com.c108.springproject.global.querydsl;

import com.mysema.commons.lang.Assert;
import com.querydsl.core.Tuple;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.dsl.*;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.Querydsl;
import org.springframework.data.querydsl.SimpleEntityPathResolver;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public abstract class Querydsl4RepositorySupport {
    private final Class<?> domainClass;
    private Querydsl querydsl;
    private EntityManager entityManager;
    private JPAQueryFactory queryFactory;


    protected Querydsl4RepositorySupport(Class domainClass) {
        this.domainClass = domainClass;
    }

    @Autowired
    public void setEntityManager(EntityManager entityManager) {
        Assert.notNull(entityManager, "EntityManager must not be null");
        JpaEntityInformation entityInformation = JpaEntityInformationSupport.getEntityInformation(domainClass, entityManager);
        SimpleEntityPathResolver resolver = SimpleEntityPathResolver.INSTANCE;
        EntityPath path = resolver.createPath(entityInformation.getJavaType());
        this.entityManager = entityManager;
        this.querydsl = new Querydsl(entityManager, new PathBuilder<>(path.getType(), path.getMetadata()));
        this.queryFactory = new JPAQueryFactory(entityManager);
    }

    @PostConstruct
    public void validate() {
        Assert.notNull(domainClass, "Domain class must not be null");
        Assert.notNull(querydsl, "Querydsl must not be null");
        Assert.notNull(entityManager, "EntityManager must not be null");
        Assert.notNull(queryFactory, "JPAQueryFactory must not be null");
    }

    protected EntityManager getEntityManager() {
        return entityManager;
    }
    protected Querydsl getQuerydsl() {
        return querydsl;
    }
    protected JPAQueryFactory getQueryFactory() {
        return queryFactory;
    }


    // 공통 query 클래스
    // 유저 타입 / 이메일 정보 파싱
    protected enum UserType {
        SELLER, ADMIN, USER;

        public String getPrefix() {
            return this.name() + " ";
        }
    }

    protected static class UserInfo {
        private final UserType userType;
        private final String email;

        public UserInfo(String userTypeWithEmail) {
            String[] parts = userTypeWithEmail.split(" ", 2);
                this.userType = UserType.valueOf(parts[0]);
                this.email = parts.length > 1 ? parts[1] : null;
        }

        public UserType getUserType() {
            return userType;
        }
        public String getEmail() {
            return email;
        }
        public boolean isValid() {
            return userType != null && email != null && !email.trim().isEmpty();
        }
    }

    // 날짜 / 시간 파싱
    protected static class DateTimeSearch {
        private final String startDateTime; // "yyyyMMdd HHmmss"
        private final String endDateTime;   // "yyyyMMdd HHmmss"

        public DateTimeSearch(String startDateTime, String endDateTime) {
            this.startDateTime = startDateTime;
            this.endDateTime = endDateTime;
        }

        public String getStartDateTime() {
            return startDateTime;
        }

        public String getEndDateTime() {
            return endDateTime;
        }

        // 날짜만 추출 (yyyyMMdd)
        public String getStartDate() {
            return startDateTime != null ? startDateTime.substring(0, 8) : null;
        }

        public String getEndDate() {
            return endDateTime != null ? endDateTime.substring(0, 8) : null;
        }

        // 시간 조회 추가 - 라이브 커머스
        public String getStartTime() {
            return startDateTime != null ? startDateTime.substring(9, 13) : null;
        }

        public String getEndTime() {
            return endDateTime != null ? endDateTime.substring(9, 13) : null;
        }
    }

    // 사용자 조회
    protected static class UserTypeExpression {
         // BooleanExpression은 null 반환 시 자동으로 조건절에서 제거
        public static BooleanExpression matchUserType(StringPath userField, UserType userType) {
            return userType != null ? userField.startsWith(userType.getPrefix()) : null;
        }


        // 이메일로 검색하는 조건 생성
        public static BooleanExpression matchEmail(StringPath userField, String email) {
            return email != null ? userField.endsWith(email) : null;
        }

        // 사용자 타입과 이메일 모두로 검색하는 조건 생성
        public static BooleanExpression matchTypeAndEmail(StringPath userField, UserType userType, String email) {
            if (userType != null && email != null) {
                return userField.eq(userType.getPrefix() + email);
            }
            return null;
        }

        // 이메일 부분만 추출하는 Expression 생성
        public static StringExpression extractEmail(StringPath userField) {
            return Expressions.stringTemplate(
                    "SUBSTRING({0}, LOCATE(' ', {0}) + 1)",
                    userField
            );
        }
    }

    // 시간 & 기간 조회
    protected BooleanExpression betweenDateTime(StringPath dateTimeField, DateTimeSearch dateTimeSearch) {
        if (dateTimeSearch == null || (dateTimeSearch.getStartDateTime() == null && dateTimeSearch.getEndDateTime() == null)) {
            return null;
        }

        if (dateTimeSearch.getStartDateTime() != null && dateTimeSearch.getEndDateTime() != null) {
            return dateTimeField.between(dateTimeSearch.getStartDateTime(), dateTimeSearch.getEndDateTime());
        }


        if (dateTimeSearch.getStartDateTime() != null) {
            // goe(DateTime): >= DateTime
            return dateTimeField.goe(dateTimeSearch.getStartDateTime());
        }

            // loe(DateTime): <= DateTime
        return dateTimeField.loe(dateTimeSearch.getEndDateTime());
    }



    /**
     * 시간대별 집계 쿼리 생성 (시간단위로 그룹핑)
     */
    protected <T extends Number> List<Tuple> aggregateByHourAndUserType(
            EntityPath<?> path,
            StringPath dateTimeField,
            StringPath createdUserField,
            DateTimeSearch dateTimeSearch,
            UserType userType,
            NumberPath<? extends Number> numberField) {

        return getQueryFactory()
                .select(
                        Expressions.stringTemplate(
                                "SUBSTRING({0}, 9, 2)",
                                dateTimeField
                        ).as("hour"),
                        numberField.sum()
                )
                .from(path)
                .where(
                        betweenDateTime(dateTimeField, dateTimeSearch),
                        UserTypeExpression.matchUserType(createdUserField, userType)
                )
                .groupBy(Expressions.stringTemplate(
                        "SUBSTRING({0}, 9, 2)",
                        dateTimeField
                ))
                .orderBy(Expressions.stringTemplate(
                        "SUBSTRING({0}, 9, 2)",
                        dateTimeField
                ).asc())
                .fetch();
    }

    /**
     * 사용자별 집계 쿼리 생성
     */
    protected <T extends Number> List<Tuple> aggregateByUserTypeAndEmail(
            EntityPath<?> path,
            StringPath userField,
            // 이렇게 하면 모든 Number 타입(Integer, Long, Double 등)을 받음
            NumberPath<? extends Number> numberField) {

        return getQueryFactory()
                .select(
                        UserTypeExpression.extractEmail(userField),
                        numberField.sum()
                )
                .from(path)
                .groupBy(UserTypeExpression.extractEmail(userField))
                .fetch();
    }


}
