package com.c108.springproject.global.jwt.RefreshToken;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {

    Optional<RefreshToken> findByAdminAdminIdAndReissueCountLessThan(String adminId, int count);
    Optional<RefreshToken> findByUserEmailAndReissueCountLessThan(String userEmail, int count);
    Optional<RefreshToken> findBySellerEmailAndReissueCountLessThan(String userEmail, int count);

    Optional<RefreshToken> findByAdminAdminId(String adminId);
    Optional<RefreshToken> findByUserEmail(String userEmail);
    Optional<RefreshToken> findBySellerEmail(String sellerEmail);

    Optional<RefreshToken> findByRefreshToken(String refreshToken);

}
