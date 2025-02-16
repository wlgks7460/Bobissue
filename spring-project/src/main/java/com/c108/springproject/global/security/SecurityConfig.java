package com.c108.springproject.global.security;

import com.c108.springproject.global.jwt.JwtAuthFilter;
import com.c108.springproject.global.oauth.CustomOAuthUserService;
import com.c108.springproject.global.oauth.OAuth2SuccessHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CustomOAuthUserService customOAuthUserService;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter,
                          CustomOAuthUserService customOAuthUserService,
                          OAuth2SuccessHandler oAuth2SuccessHandler){
        this.jwtAuthFilter = jwtAuthFilter;
        this.customOAuthUserService = customOAuthUserService;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{

        httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOriginPatterns(List.of(
                            "http://localhost:5173",
                            "http://43.202.60.173:5173",
//                            "https://bobissue.store:5443",
//                            "http://bobissue.store:5443",
                            "https://www.bobissue.store",
                            "http://www.bobissue.store",
                            "https://bobissue.store",
                            "http://bobissue.store",
                            "http://bobissue.duckdns.org",
                            "https://bobissue.duckdns.org",
                            "http://localhost:8080",  // WebSocket 요청을 허용
                            "http://localhost:8082",  // WebSocket 요청을 허용
                            "http://localhost:4443",  // WebSocket 요청을 허용
                            "https://localhost:4443"  // WebSocket 요청을 허용
//                            "ws://**",
//                            "wss://**"
                    ));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.setAllowCredentials(true);
                    corsConfiguration.addExposedHeader("newAccessToken");
                    return corsConfiguration;
                }))
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//                .securityMatcher("/api/**")
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers("/wss/**").permitAll()
                        .requestMatchers( "/oauth2/**").permitAll() // OAuth2 관련 URL 허용
                        .requestMatchers( "/openvidu/**").permitAll() // openvidu 관련 URL 허용
                        .requestMatchers("/api/openvidu/**").permitAll() // 추가
                        .requestMatchers("https://bobissue.store:5443/api/openvidu/**").permitAll() // 추가
                        .requestMatchers("https://bobissue.store:5443/openvidu/**").permitAll() // 추가
                        .requestMatchers(
                                "/api/users/sign-up",
                                "/api/users/kakao/sign-up",
                                "/api/auths/**",
                                "/api/sellers/sign-up",
                                "/api/check-password",
                                "/api/check-email",
                                "/api/auths/user-login",
                                "/api/auths/seller-login",
                                "/api/auths/admin-login",
                                "/api/item",
                                "/api/item/{itemNo}",
                                "/api/categories",
                                "/api/categories/{categoryNo}",
                                "/api/item/{itemNo}/review",
                                "/api/item/{itemNo}/review/{reviewNo}",
                                "/api/cast",
                                "/api/cast/{castNo}",
                                "/api/cast/{chatNo}/chat",
                                "/api/recipecategory",
                                "/api/recipecategory/{recipeCategoryNo}",
                                "/api/recipe",
                                "/api/recipe/{recipeNo}",
                                "/api/question",
                                "/api/question/{questionNo}",
                                "/api/event/{eventNo}",
                                "/api/event/banner"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(
                        oauth -> oauth
                                .userInfoEndpoint(c -> c.userService(customOAuthUserService))
                                .successHandler(oAuth2SuccessHandler)
                )
                .exceptionHandling(exceptionHandling -> exceptionHandling
                        .authenticationEntryPoint(new CustomAuthenticationEntryPoint())
                        .accessDeniedHandler(new CustomAccessDeniedHandler())
                )
                .addFilterBefore(jwtAuthFilter, BasicAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
