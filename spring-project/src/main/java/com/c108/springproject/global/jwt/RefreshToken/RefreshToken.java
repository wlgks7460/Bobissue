package com.c108.springproject.global.jwt.RefreshToken;

import com.c108.springproject.admin.domain.Admin;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Entity
@Getter
@NoArgsConstructor
public class RefreshToken implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", referencedColumnName = "adminId")
    private Admin admin;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    private User user;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_email", referencedColumnName = "email")
    private Seller seller;

    @Column(name = "refresh_token")
    private String refreshToken;

    private int reissueCount = 0;

    public RefreshToken(Admin admin, String refreshToken) {
        this.admin = admin;
        this.refreshToken = refreshToken;
    }

    public RefreshToken(User user, String refreshToken) {
        this.user = user;
        this.refreshToken = refreshToken;
    }

    public RefreshToken(Seller seller, String refreshToken) {
        this.seller = seller;
        this.refreshToken = refreshToken;
    }


    public void updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public boolean validateRefreshToken(String refreshToken) {
        return this.refreshToken.equals(refreshToken);
    }

    public void increaseReissueCount(){
        reissueCount++;
    }
}
