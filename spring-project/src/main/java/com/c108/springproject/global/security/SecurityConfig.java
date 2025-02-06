package com.c108.springproject.global.security;

import com.c108.springproject.global.jwt.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    public SecurityConfig(JwtAuthFilter jwtAuthFilter){
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception{

        httpSecurity
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of(
                            "http://localhost:5173",
                            "http://bobissue.duckdns.org",
                            "https://bobissue.duckdns.org:"
                    ));
                    corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                    corsConfiguration.setAllowedHeaders(List.of("*"));
                    corsConfiguration.addExposedHeader("newAccessToken");
                    return corsConfiguration;
                }))
                .httpBasic(basic -> basic.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .securityMatcher("/api/**")
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(
                                "/api/users/sign-up",
                                "/api/users/social",
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
                .addFilterBefore(jwtAuthFilter, BasicAuthenticationFilter.class);
        return httpSecurity.build();
    }
}
