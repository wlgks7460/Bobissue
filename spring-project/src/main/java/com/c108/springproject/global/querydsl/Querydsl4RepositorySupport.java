package com.c108.springproject.global.querydsl;

import com.mysema.commons.lang.Assert;
import com.querydsl.core.types.EntityPath;
import com.querydsl.core.types.dsl.PathBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.data.jpa.repository.support.Querydsl;
import org.springframework.data.querydsl.SimpleEntityPathResolver;
import org.springframework.stereotype.Repository;

@Repository
public abstract class Querydsl4RepositorySupport {
    private final Class domainClass;
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


    // 공통 query
    // 유저 타입
    protected enum UserType {
        SELLER, ADMIN, USER;

        public String getPrefix() {
            return this.name() + " ";
        }
    }

    protected static class UserInfo {
        private final UserType userType;
        private final String email;

        protected UserInfo(UserType userType, String email) {
            this.userType = userType;
            this.email = email;
        }
    }





}
