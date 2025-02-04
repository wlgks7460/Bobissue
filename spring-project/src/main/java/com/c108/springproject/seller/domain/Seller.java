package com.c108.springproject.seller.domain;

import com.c108.springproject.global.entity.BaseEntity;
import com.c108.springproject.seller.dto.SellerDto;
import com.c108.springproject.seller.dto.SellerUpdateReq;
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
public class Seller extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int sellerNo;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 1, columnDefinition = "CHAR(1)")
    private String status;

    @OneToOne
    @JoinColumn(name = "company_no")
    private Company companyNo;

    @Column(nullable = false, length = 15)
    private String callNumber;

    @Column(nullable = false, length = 50)
    private String name;

    public void updateSeller(SellerUpdateReq sellerUpdateReq) {
        this.name = sellerUpdateReq.getName();
        this.callNumber = sellerUpdateReq.getCallNumber();
    }

}
