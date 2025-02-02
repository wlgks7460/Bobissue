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

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Cast extends BaseEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int castNo;

    @ManyToOne
    @JoinColumn(name = "seller_no", nullable = false)
    private Seller sellerNo;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String content;

    @Column(nullable = false, length = 15)
    private String startAt;

    @Column(nullable = false)
    private int castTime;

    public void updateCast(CastReqDto castReqDto){
        this.title = castReqDto.getTitle();
        this.content = castReqDto.getContent();
        this.startAt = castReqDto.getStartAt();
        this.castTime = castReqDto.getCastTime();
    }




}
