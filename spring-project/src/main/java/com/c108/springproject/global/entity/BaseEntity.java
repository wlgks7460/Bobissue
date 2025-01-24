package com.c108.springproject.global.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.text.SimpleDateFormat;
import java.util.Date;

@Getter
@Setter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity {

    @Column(nullable = false, length = 15)
    private String createdAt;

    @Column(nullable = false)
    private int createdUser;

    @Column(nullable = false, length = 15)
    private String updatedAt;

    @Column(nullable = false)
    private int updatedUser;

    @Column(length = 1, nullable = false, columnDefinition = "CHAR(1)")
    private String delYn = "N";

    // 엔티티가 생성될 때 호출되어 createdAt을 현재 날짜로 설정
    @PrePersist
    public void onPrePersist() {
        String currentDate = getCurrentDate();
        this.createdAt = currentDate;
        this.updatedAt = currentDate;// 생성될 때 업데이트 날짜도 같게 설정
    }

    // 엔티티가 업데이트될 때 호출되어 updatedAt을 현재 날짜로 설정
    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = getCurrentDate();
    }

    private String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HHmmss");
        return sdf.format(new Date());
    }

    public void delete(){
        this.delYn = "Y";
    }
}
