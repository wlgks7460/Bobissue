package com.c108.springproject.global.jwt;

import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.jwt.RefreshToken.RefreshToken;
import com.c108.springproject.global.jwt.RefreshToken.RefreshTokenRepository;
import com.c108.springproject.global.redis.RedisService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.*;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.Date;
import java.util.Map;

@Service
@Getter
@Slf4j
public class JwtTokenProvider {

    private final String secretKey;
    private final Long accessTokenExpirationMinutes;
    private final Long refreshTokenExpirationHours;
    private final String issuer;
    private final int reissueLimit;
    private final RefreshTokenRepository refreshTokenRepository;
    private final RedisService redisService;

    private final ObjectMapper objectMapper = new ObjectMapper(); // JWT 역직렬화를 위한 ObjectMapper

    public JwtTokenProvider(
            @Value("${jwt.secretKey}") // 암호화할 키
            String secretKey,
            @Value("${jwt.access.expiration}") // 엑세스 토크 유효시간
            long accessTokenExpirationMinutes,
            @Value("${jwt.refresh.expiration-hours}") // 리프레시 토큰 유효시간
            long refreshTokenExpirationHours,
            @Value("${jwt.issuer}") // 토큰 발급자
            String issuer,
            RefreshTokenRepository refreshTokenRepository,
            RedisService redisService
    ) {
        this.secretKey = secretKey;
        this.accessTokenExpirationMinutes = accessTokenExpirationMinutes;
        this.refreshTokenExpirationHours = refreshTokenExpirationHours;
        this.issuer = issuer;
        this.refreshTokenRepository = refreshTokenRepository;
        this.redisService = redisService;
        reissueLimit = (int) (refreshTokenExpirationHours * 60 / accessTokenExpirationMinutes);
    }

    public String createAccessToken(String userSpecification){
        String accessToken = Jwts.builder()
                .signWith(SignatureAlgorithm.HS256,secretKey.getBytes()) // HS256으로 암호화, secretKey를 이용해 서명
                .setSubject(userSpecification) // JWT 토큰제목 (이메일이 들어감)
                .setIssuer(issuer) // JWT 토큰 발급자
                .setIssuedAt(Timestamp.valueOf(LocalDateTime.now())) // JWT 토큰 발급 시간
                .setExpiration(Date.from(Instant.now().plus(accessTokenExpirationMinutes, ChronoUnit.SECONDS))) // JWT 토큰의 만료시간 설정
                .compact(); // JWT 토큰 생성
        return accessToken;
    }

    public String createRefreshToken(String role, int id) {
        String refreshToken = Jwts.builder()
                .signWith(SignatureAlgorithm.HS256, secretKey.getBytes())
                .setIssuer(issuer)
                .setIssuedAt(Timestamp.valueOf(LocalDateTime.now()))
                .setExpiration(Date.from(Instant.now().plus(refreshTokenExpirationHours, ChronoUnit.SECONDS)))
                .compact();
        redisService.setValues(role+id ,refreshToken, Duration.ofHours(24L));
        return refreshToken;
    }

    public String validateTokenAndGetSubject(String token){
//        return Jwts.parser()
//                .setSigningKey(secretKey.getBytes())
//                .parseClaimsJws(token)
//                .getBody()
//                .getSubject();

        try {
            return Jwts.parser()
                    .setSigningKey(secretKey.getBytes())
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            log.warn("토큰 만료됨");
            throw e;  // 여기서 반드시 예외를 다시 던져야 함
        } catch (Exception e) {
            log.warn("토큰 검증 실패");
            return null;
        }
    }

    @Transactional
    public String recreateAccessToken(String oldAccessToken) throws JsonProcessingException {
        // 기존 액세스 토큰 토대로 새로운 토큰 생성
        String subject = decodeJwtPayloadSubject(oldAccessToken);
        if(decodeJwtPayloadSubject(oldAccessToken).split(":")[1].equals("USER")){
            refreshTokenRepository.findByUserEmailAndReissueCountLessThan(
                    subject.split(":")[0],reissueLimit
            ).ifPresentOrElse(
                    RefreshToken::increaseReissueCount,
                    ()-> { throw new ExpiredJwtException(null, null, "Refresh token expired"); }
            );
        }else if(decodeJwtPayloadSubject(oldAccessToken).split(":")[1].equals("SELLER")){
            refreshTokenRepository.findBySellerEmailAndReissueCountLessThan(
                    subject.split(":")[0],reissueLimit
            ).ifPresentOrElse(
                    RefreshToken::increaseReissueCount,
                    ()-> { throw new ExpiredJwtException(null, null, "Refresh token expired"); }
            );
        }else {
            refreshTokenRepository.findByAdminAdminIdAndReissueCountLessThan(
                    subject.split(":")[0],reissueLimit
            ).ifPresentOrElse(
                    RefreshToken::increaseReissueCount,
                    ()-> { throw new ExpiredJwtException(null, null, "Refresh token expired"); }
            );
        }
        return createAccessToken(subject);
    }

    @Transactional
    public void validateRefreshToken(String refreshToken, String oldAccessToken) throws JsonProcessingException {
        validateAndPraseToken(refreshToken); // 리프레시 토큰이 유효한 토큰인지 검증
        if(decodeJwtPayloadSubject(oldAccessToken).split(":")[1].equals("USER")){
            String key = decodeJwtPayloadSubject(oldAccessToken).split(":")[0];
            try {
                refreshTokenRepository.findByUserEmailAndReissueCountLessThan(key, reissueLimit)
                        .filter(userRefreshToken -> userRefreshToken.validateRefreshToken(refreshToken))
                        .orElseThrow(() -> new ExpiredJwtException(null, null, "Refresh token expired"));
            } catch (ExpiredJwtException e) {
                // 만료된 리프레시 토큰 처리
                RefreshToken findtoken = refreshTokenRepository.findByRefreshToken(refreshToken).orElseThrow(
                        () -> new BobIssueException(ResponseCode.REFRESH_TOKEN_NOT_FOUND)
                );
                refreshTokenRepository.delete(findtoken);
                redisService.deleteValues("USER" + "" + findtoken.getUser().getUserNo());
                // ExpiredJwtException 다시 던지거나 적절한 처리를 진행
            }
        }else if(decodeJwtPayloadSubject(oldAccessToken).split(":")[1].equals("SELLER")){
            String key = decodeJwtPayloadSubject(oldAccessToken).split(":")[0];
            try {
                refreshTokenRepository.findBySellerEmailAndReissueCountLessThan(key, reissueLimit)
                        .filter(userRefreshToken -> userRefreshToken.validateRefreshToken(refreshToken))
                        .orElseThrow(() -> new ExpiredJwtException(null, null, "Refresh token expired"));
            } catch (ExpiredJwtException e) {
                // 만료된 리프레시 토큰 처리
                RefreshToken findtoken = refreshTokenRepository.findByRefreshToken(refreshToken).orElseThrow(
                        () -> new BobIssueException(ResponseCode.REFRESH_TOKEN_NOT_FOUND)
                );
                refreshTokenRepository.delete(findtoken);
                redisService.deleteValues("SELLER" + "" + findtoken.getSeller().getSellerNo());
                // ExpiredJwtException 다시 던지거나 적절한 처리를 진행
            }

        }else {
            String key = decodeJwtPayloadSubject(oldAccessToken).split(":")[0];
            try {
                refreshTokenRepository.findByAdminAdminIdAndReissueCountLessThan(key, reissueLimit)
                        .filter(userRefreshToken -> userRefreshToken.validateRefreshToken(refreshToken))
                        .orElseThrow(() -> new ExpiredJwtException(null, null, "Refresh token expired"));
            } catch (ExpiredJwtException e) {
                // 만료된 리프레시 토큰 처리
                RefreshToken findtoken = refreshTokenRepository.findByRefreshToken(refreshToken).orElseThrow(
                        () -> new BobIssueException(ResponseCode.REFRESH_TOKEN_NOT_FOUND)
                );
                refreshTokenRepository.delete(findtoken);
                redisService.deleteValues("ADMIN" + "" + findtoken.getAdmin().getAdminNo());
                // ExpiredJwtException 다시 던지거나 적절한 처리를 진행
            }
        }
    }

    private Jws<Claims> validateAndPraseToken(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey.getBytes())
                // parseClaimsJws()에서 JWT를 파싱할때, 토큰이 유효한지 검사하여 예외를 던짐 = 토큰 검증
                .parseClaimsJws(token);
    }


    private String decodeJwtPayloadSubject(String oldAccessToken) throws JsonProcessingException {
        return objectMapper.readValue(
                // JWT를 복호화하고 데이터가 담겨있는 payload에서 Subject를 반환 (email:role)
                new String(Base64.getDecoder().decode(oldAccessToken.split("\\.")[1]), StandardCharsets.UTF_8),
                Map.class
        ).get("sub").toString();
    }
}
