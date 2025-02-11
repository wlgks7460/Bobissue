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
                            "http://bobissue.duckdns.org",
                            "https://bobissue.duckdns.org",
                            "ws://**",
                            "wss://**"
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
                        .requestMatchers( "/oauth2/**").permitAll() // OAuth2 관련 URL 허용
                        .requestMatchers(
                                "/api/users/sign-up",
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
                                "/api/question/{questionNo}"
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
