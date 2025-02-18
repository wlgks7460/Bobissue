package com.c108.springproject.address.domain;

import com.c108.springproject.address.dto.AddressReqDto;
import com.c108.springproject.address.dto.AddressResDto;
import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.user.domain.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Address extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int addressNo;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_no", nullable = false)
    private User user;

    @Column(nullable = false)
    private String postalCode;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String addressDetail;


    public void changeAddressDetail(AddressReqDto addressReqDto){
        this.name=addressReqDto.getName();
        this.postalCode=addressReqDto.getPostalCode();
        this.address=addressReqDto.getAddress();
        this.addressDetail=addressReqDto.getAddressDetail();
    }





}
