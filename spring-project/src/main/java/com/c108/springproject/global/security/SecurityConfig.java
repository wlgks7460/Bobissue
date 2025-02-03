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
                                "/api/users/doLogin",
                                "/api/users/sign-up"
                        ).permitAll()
//                        // 특정 권한이 있어야만 특정 API에 접근할 수 있도록 설정
//                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        //나머지 요청은 인증이 되어야함
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, BasicAuthenticationFilter.class);
    return httpSecurity.build();
    }
}
