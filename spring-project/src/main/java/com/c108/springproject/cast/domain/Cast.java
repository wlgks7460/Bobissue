package com.c108.springproject.cast.domain;

import com.c108.springproject.cast.dto.requset.CastReqDto;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.seller.domain.Seller;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cast extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int castNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_no", nullable = false)
    private Seller seller;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false, length = 15)
    private String startAt;

    @Column(nullable = false, length = 15)
    private String endAt;

    @OneToMany(mappedBy = "cast", cascade = CascadeType.ALL, fetch = FetchType.LAZY , orphanRemoval = true)
    private List<CastItem> castItems;

    @Enumerated(EnumType.STRING)
    private CastStatus castStatus;

    @Column
    private String castRoomId;

    public void updateCast(CastReqDto castReqDto){
        this.title = castReqDto.getTitle();
        this.content = castReqDto.getContent();
        this.startAt = castReqDto.getStartAt();
        this.endAt = castReqDto.getEndAt();
    }

    public void registerCast(){
        this.castStatus = CastStatus.AWAIT;
    }

    public void refusalCast(){
        this.castStatus = CastStatus.REFUSAL;
    }

    public void startCast(String castRoomId){
        this.castStatus = CastStatus.ONAIR;
        this.castRoomId = castRoomId;
    }

    public void endCast(){
        this.castStatus = CastStatus.TERMINATE;
        this.castRoomId = null;
    }




}
