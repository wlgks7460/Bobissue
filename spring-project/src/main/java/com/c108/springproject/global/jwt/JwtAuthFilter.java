package com.c108.springproject.global.jwt;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.WebAuthenticationDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

// 요약된 흐름
//
//HTTP 요청을 받을 때마다 실행되는 필터
//Authorization 헤더에서 Access Token을 가져와 검증
//토큰이 유효하면 SecurityContextHolder에 사용자 정보 설정
//Access Token이 만료되었으면 Refresh Token을 이용해 새 Access Token 발급
//새로운 Access Token을 응답 헤더에 추가
//✅ 핵심 기능
//
//doFilterInternal → 요청마다 JWT 검증 및 사용자 인증 처리
//parseBearerToken → Authorization 헤더에서 Bearer 토큰 추출
//parseUserSpecification → JWT에서 사용자 정보(이메일, 역할) 가져오기
//reissueAccessToken → Refresh Token으로 새 Access Token 발급


@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = parseBearerToken(request, HttpHeaders.AUTHORIZATION);
            log.info("Filter is running");
            if (token != null && !token.equalsIgnoreCase("null")) {
                User user = parseUserSpecification(token);
                AbstractAuthenticationToken authentication = UsernamePasswordAuthenticationToken.authenticated(user, token, user.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (ExpiredJwtException e) {
            reissueAccessToken(request, response, e);
        } catch (Exception exception) {
            logger.error("could not set user authentication in security context", exception);
        }
        filterChain.doFilter(request, response);
    }

    //    HTTP 요청 헤에 Authorization 값을 찾아서 Bearer로 시작하는지 확인 하고 접두어를 제외한 토큰값으로 parsing
    //    헤더에 Authorization 값이 존재하지 않거나 접두어가 Bearer가 아니면 null을 반환한다.
    private String parseBearerToken(HttpServletRequest request, String headerName) {
        return Optional.ofNullable(request.getHeader(headerName))
                .filter(token -> token.substring(0, 7).equalsIgnoreCase("Bearer "))
                .map(token -> token.substring(7))
                .orElse(null);
    }

    //    토큰값을 토대로 토큰에 담긴
    private User parseUserSpecification(String token) {
        String[] split = Optional.ofNullable(token)
                .filter(subject -> subject.length() >= 10)
                .map(jwtTokenProvider::validateTokenAndGetSubject)
                .orElse("anonymous:anonymous")
                .split(":");

        return new User(split[0], "", List.of(new SimpleGrantedAuthority(split[1])));
    }

    private void reissueAccessToken(HttpServletRequest request, HttpServletResponse response, Exception exception) {
        try {
            String refreshToken = parseBearerToken(request, "refreshToken");
            if (refreshToken == null) {
                throw exception;
            }
            String oldAccessToken = parseBearerToken(request, HttpHeaders.AUTHORIZATION);
            jwtTokenProvider.validateRefreshToken(refreshToken, oldAccessToken);
            String newAccessToken = jwtTokenProvider.recreateAccessToken(oldAccessToken);
            User user = parseUserSpecification(newAccessToken);
            UsernamePasswordAuthenticationToken authenticated = UsernamePasswordAuthenticationToken.authenticated(user, newAccessToken, user.getAuthorities());
            authenticated.setDetails(new WebAuthenticationDetails(request));
            SecurityContextHolder.getContext().setAuthentication(authenticated);

            response.setHeader("newAccessToken", newAccessToken);
        } catch (Exception e) {
            request.setAttribute("exception", e);
        }
    }

}
