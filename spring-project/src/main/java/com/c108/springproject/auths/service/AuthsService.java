package com.c108.springproject.auths.service;

import com.c108.springproject.admin.domain.Admin;
import com.c108.springproject.admin.repository.AdminRepository;
import com.c108.springproject.auths.dto.request.LoginReqDto;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.jwt.JwtTokenProvider;
import com.c108.springproject.global.jwt.RefreshToken.RefreshToken;
import com.c108.springproject.global.jwt.RefreshToken.RefreshTokenRepository;
import com.c108.springproject.global.redis.RedisService;
import com.c108.springproject.seller.domain.Seller;
import com.c108.springproject.seller.repository.SellerRepository;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import org.springframework.http.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AuthsService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SellerRepository sellerRepository;
    private final AdminRepository adminRepository;
    private final RedisService redisService;

    public AuthsService(UserRepository userRepository,
                        JwtTokenProvider jwtTokenProvider,
                        RefreshTokenRepository refreshTokenRepository,
                        SellerRepository sellerRepository,
                        AdminRepository adminRepository,
                        RedisService redisService){
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.refreshTokenRepository = refreshTokenRepository;
        this.sellerRepository =sellerRepository;
        this.adminRepository = adminRepository;
        this.redisService = redisService;
    }

    @Transactional
    public Map<String, String> userLogin(LoginReqDto loginReqDto){
        try{
            User user = userRepository.findByEmailAndDelYnAndStatus(loginReqDto.getEmail(),"N", "Y").orElseThrow(()-> new BobIssueException(ResponseCode.USER_NOT_FOUND));


            if(!loginReqDto.getPassword().equals(user.getPassword())){
                throw new BobIssueException(ResponseCode.FAIL_PASSWORD_CHECK);
            }

            String accessToken = jwtTokenProvider.createAccessToken(String.format("%s:%s", user.getEmail(), "USER"));
            String refreshToken = jwtTokenProvider.createRefreshToken("USER", user.getUserNo());

            refreshTokenRepository.findByUserEmail(user.getEmail())
                    .ifPresentOrElse(
                            it -> it.updateRefreshToken(refreshToken),
                            () -> refreshTokenRepository.save(new RefreshToken(user, refreshToken))
                    );

            Map<String, String> result = new HashMap<>();

            result.put("access_token", accessToken);
            result.put("refresh_token", refreshToken);

            return result;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_LOGIN);
        }
    }

    @Transactional
    public Map<String, String> sellerLogin(LoginReqDto loginReqDto){
        try{
            Seller seller = sellerRepository.findByEmail(loginReqDto.getEmail()).orElseThrow(()-> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));

            if(!loginReqDto.getPassword().equals(seller.getPassword())){
                throw new BobIssueException(ResponseCode.FAIL_PASSWORD_CHECK);
            }

            String accessToken = jwtTokenProvider.createAccessToken(String.format("%s:%s", seller.getEmail(), "SELLER"));
            String refreshToken = jwtTokenProvider.createRefreshToken("SELLER", seller.getSellerNo());

            refreshTokenRepository.findBySellerEmail(seller.getEmail())
                    .ifPresentOrElse(
                            it -> it.updateRefreshToken(refreshToken),
                            () -> refreshTokenRepository.save(new RefreshToken(seller, refreshToken))
                    );

            Map<String, String> result = new HashMap<>();

            result.put("access_token", accessToken);
            result.put("refresh_token", refreshToken);

            return result;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_LOGIN);
        }
    }

    @Transactional
    public Map<String, String> adminLogin(LoginReqDto loginReqDto){
        try{
            Admin admin = adminRepository.findByAdminId(loginReqDto.getEmail()).orElseThrow(()-> new BobIssueException(ResponseCode.ADMIN_NOT_FOUND));

            if(!loginReqDto.getPassword().equals(admin.getAdminPassword())){
                throw new BobIssueException(ResponseCode.FAIL_PASSWORD_CHECK);
            }

            String accessToken = jwtTokenProvider.createAccessToken(String.format("%s:%s", admin.getAdminId(), "ADMIN"));
            String refreshToken = jwtTokenProvider.createRefreshToken("ADMIN", admin.getAdminNo());

            refreshTokenRepository.findByAdminAdminId(admin.getAdminId())
                    .ifPresentOrElse(
                            it -> it.updateRefreshToken(refreshToken),
                            () -> refreshTokenRepository.save(new RefreshToken(admin, refreshToken))
                    );

            Map<String, String> result = new HashMap<>();

            result.put("access_token", accessToken);
            result.put("refresh_token", refreshToken);

            return result;
        }catch (BobIssueException e){
            throw new BobIssueException(ResponseCode.FAILED_LOGIN);
        }
    }

    @Transactional
    public String doLogout(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println(email);
        String role = SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(", "));
        System.out.println(role);

        if(role.equals("USER")){
            User user = userRepository.findByEmailAndDelYnAndStatus(email, "N", "Y").orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));
            RefreshToken refreshToken = refreshTokenRepository.findByUserEmail(user.getEmail()).orElseThrow(
                    () -> new BobIssueException(ResponseCode.REFRESH_TOKEN_NOT_FOUND)
            );

            refreshTokenRepository.delete(refreshToken);
            redisService.deleteValues("USER" + "" + user.getUserNo());
        }

        if(role.equals("SELLER")){
            Seller seller = sellerRepository.findByEmail(email).orElseThrow(() -> new BobIssueException(ResponseCode.SELLER_NOT_FOUND));
            RefreshToken refreshToken = refreshTokenRepository.findBySellerEmail(seller.getEmail()).orElseThrow(
                    () -> new BobIssueException(ResponseCode.REFRESH_TOKEN_NOT_FOUND)
            );

            refreshTokenRepository.delete(refreshToken);
            redisService.deleteValues("SELLER" + "" + seller.getSellerNo());
        }


        if(role.equals("ADMIN")){
            Admin admin = adminRepository.findByAdminId(email).orElseThrow(() -> new BobIssueException(ResponseCode.ADMIN_NOT_FOUND));
            RefreshToken refreshToken = refreshTokenRepository.findByAdminAdminId(admin.getAdminId()).orElseThrow(
                    () -> new BobIssueException(ResponseCode.REFRESH_TOKEN_NOT_FOUND)
            );

            refreshTokenRepository.delete(refreshToken);
            redisService.deleteValues("ADMIN" + "" + admin.getAdminNo());
        }
        return email;

    }


    @Transactional
    public User findByEmail(String email) {
        return userRepository.findByEmailAndDelYnAndStatus(email,"N", "Y").orElseThrow(()->new BobIssueException(ResponseCode.NOT_FOUND_USER));
    }

    @Transactional
    public String getOauthUser(String provider, String accessToken) {

        if (provider.equals("naver")) {
            String url = "https://openapi.naver.com/v1/nid/me";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = new RestTemplate().exchange(url, HttpMethod.GET, entity, Map.class);

            Map<String, Object> responseBody = (Map<String, Object>) response.getBody().get("response");

            return (String) responseBody.get("email");

        } else if (provider.equals("kakao")) {
            String url = "https://kapi.kakao.com/v2/user/me";

            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<Map> response = new RestTemplate().exchange(url, HttpMethod.GET, entity, Map.class);

            Map<String, Object> responseBody = (Map<String, Object>) response.getBody();
            Map<String, Object> kakaoAccount = (Map<String, Object>) responseBody.get("kakao_account");

            return (String) kakaoAccount.get("email");
        }

        return null;
    }

//
//    @Transactional
//    public Map<String, String> findOauthUser(String provider, String token){
//        User user = userRepository.findByEmail(token).orElseThrow(() -> new BobIssueException(ResponseCode.USER_NOT_FOUND));
//        try{
//            String accessToken = jwtTokenProvider.createAccessToken(String.format("%s:%s", user.getEmail(), "USER"));
//            String refreshToken = jwtTokenProvider.createRefreshToken("USER", user.getUserNo());
//
//            refreshTokenRepository.findByUserEmail(user.getEmail())
//                    .ifPresentOrElse(
//                            it -> it.updateRefreshToken(refreshToken),
//                            () -> refreshTokenRepository.save(new RefreshToken(user, refreshToken))
//                    );
//
//            Map<String, String> result = new HashMap<>();
//
//            result.put("access_token", accessToken);
//            result.put("refresh_token", refreshToken);
//
//            return result;
//        }catch (BobIssueException e){
//            throw new BobIssueException(ResponseCode.FAILED_LOGIN);
//        }
//    }


}
