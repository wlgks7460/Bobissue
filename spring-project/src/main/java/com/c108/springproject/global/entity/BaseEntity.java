package com.c108.springproject.global.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

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
    private String createdUser;

    @Column(nullable = false, length = 15)
    private String updatedAt;

    @Column(nullable = false)
    private String updatedUser;

    @Column(length = 1, nullable = false, columnDefinition = "CHAR(1)")
    private String delYn = "N";


    // created, updated User 설정
    private void setCeatedAndupdatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String userType = determineUserType(authentication);
            String userId = authentication.getName();  // 또는 다른 방식으로 ID 획득

            String userInfo = userType + " " + userId;
            this.createdUser = userInfo;
            this.updatedUser = userInfo;
        } else {
            this.createdUser = null;
            this.updatedUser = null;
        }
    }

    private void setUpdatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null) {
            String userType = determineUserType(authentication);
            String userId = authentication.getName();  // 또는 다른 방식으로 ID 획득

            this.updatedUser = userType + " " + userId;
        }
    }

    private String determineUserType(Authentication authentication) {
        if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"))) {
            return "ADMIN";
        } else if (authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("SELLER"))) {
            return "SELLER";
        } else {
            return "USER";
        }
    }
    
    // 이메일 추출  -> 공백을 기준으로 뒷 부분
    public String extractEmail() {
        String[] parts = this.createdUser.split(" ");
        return parts.length > 1 ? parts[1] : null;
    }

    // 엔티티가 생성될 때 호출되어 createdAt을 현재 날짜로 설정
    @PrePersist
    public void onPrePersist() {
        String currentDate = getCurrentDate();
        this.createdAt = currentDate;
        this.updatedAt = currentDate;// 생성될 때 업데이트 날짜도 같게 설정
        setCeatedAndupdatedUser();
    }

    // 엔티티가 업데이트될 때 호출되어 updatedAt을 현재 날짜로 설정
    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = getCurrentDate();
        setUpdatedUser();
    }

    private String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd HHmmss");
        return sdf.format(new Date());
    }

    public void delete(){
        this.delYn = "Y";
    }
}
