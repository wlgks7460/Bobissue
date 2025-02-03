package com.c108.springproject.global.security;

import com.c108.springproject.global.jwt.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    public SecurityConfig(JwtAuthFilter jwtAuthFilter){
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{
        httpSecurity
                //CSRF(Cross-Site Request Forgery) 공격을 방지하는 기능을 끔
                //JWT 기반 인증, rest api는 CSRF 보호가 필요하지 않음
                .csrf(csrf -> csrf.disable())
                //CORS 설정
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of(
                            "http://localhost:5173",
                            "http://bobissue.duckdns.org",
                            "https://bobissue.duckdns.org:"
                    ));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.addExposedHeader("New-Access-Token");
                    return corsConfiguration;
                }))
                //Basic Authentication 을 비활성화
                //JWT 기반 인증 사용
                .httpBasic(basic -> basic.disable())
                //JWT 인증 방식에서는 서버가 세션을 유지할 필요가 없음 -> 세션을 사용하지 않음
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                //인증 및 권한 설정
                .authorizeHttpRequests(auth -> auth
                        //해당 url은 인증 필요 x
                        .requestMatchers(
                                "/api/users/sign-up",
                                "/api/users/social",
                                "/api/seller/sign-up",
                                "/api/check-password",
                                "/api/check-email",
                                "/api/auths/user-login",
                                "/api/auths/seller-login",
                                "/api/auths/admin-login",
                                "/api/items",
                                "/api/items/{item-no}",
                                "/api/categories",
                                "/api/categories/{category-no}",
                                "/api/item/{item_no}/review",
                                "/api/item/{item_no}/review/{review_no}",
                                "/api/cast",
                                "/api/cast/{cast_no}",
                                "/api/cast/{chat-no}/chat"
                        ).permitAll()
//                        // 특정 권한이 있어야만 특정 API에 접근할 수 있도록 설정
                        .requestMatchers(
                                "/api/users/{user-no}",
                                "/api/change-password",
                                "/api/auths/logout",
                                "/api/auths/token",
                                "/api/items/{item-no}/like",
                                "/api/orders/**",
                                "/api/payments/**",
                                "/api/item/{item_no}/review/**",
                                "/api/questions",
                                "/api/questions/{question_no}",
                                "/api/questions/{question_no}/answer",
                                "/api/notification/user-only",
                                "/api/notification/{notification_no}",
                                "/api/cast/{chat-no}/chat",
                                "/api/recipe"
                        ).hasRole("USER")
                        .requestMatchers(
                                "/api/sellers/{seller-no}",
                                "/api/change-password",
                                "/api/auths/logout",
                                "/api/auths/token",
                                "/api/items",
                                "/api/items/{item-no}",
                                "/api/item/{item_no}/review/{review_no}/report",
                                "/api/questions/",
                                "/api/questions/{question_no}",
                                "/api/questions/{question_no}/answer",
                                "/api/notification/seller-only",
                                "/api/notification/{notification_no}",
                                "/api/cast/",
                                "/api/cast/{chat-no}/chat"
                        ).hasRole("SELLER")
                        .requestMatchers(
                                "/api/users/{user-no}",
                                "/api/users",
                                "/api/sellers/{seller-no}",
                                "/api/sellers",
                                "/api/admin/**",
                                "/api/api",
                                "/api/auths/logout",
                                "/api/auths/token",
                                "/api/items/{item-no}",
                                "/api/categories",
                                "/api/categories/{category-no}",
                                "/api/orders/**",
                                "/api/payments/**",
                                "/api/item/{item_no}/review/{review_no}/report",
                                "/api/questions",
                                "/api/questions/{question_no}",
                                "/api/questions/{question_no}/answer",
                                "/api/notification/**",
                                "/api/cast/**",
                                "/api/recipe"
                        ).hasRole("ADMIN")
                        //나머지 요청은 인증이 되어야함
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, BasicAuthenticationFilter.class);
    return httpSecurity.build();
    }
}
