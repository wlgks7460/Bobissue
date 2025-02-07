package com.c108.springproject.global.oauth;

import com.c108.springproject.auths.dto.request.LoginReqDto;
import com.c108.springproject.auths.service.AuthsService;
import com.c108.springproject.global.BobIssueException;
import com.c108.springproject.global.ResponseCode;
import com.c108.springproject.global.jwt.JwtTokenProvider;
import com.c108.springproject.user.domain.User;
import com.c108.springproject.user.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final AuthsService authsService;
    private static final String URI = "/auths/user-login";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        PrincipalDetails principalDetails = (PrincipalDetails) authentication.getPrincipal();
        Map<String, Object> attributes = principalDetails.getAttributes();
        Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");

        String email = (String) kakaoAccount.get("email");
        System.out.println("OAuth 로그인 성공: " + email);

        if(userRepository.findByEmail(email).isPresent()){
            // ✅ 일반 로그인 로직 재사용 (비밀번호 검증 없이 토큰만 발급)
            LoginReqDto loginReqDto = new LoginReqDto(email, "11111"); // 비밀번호 필요 X
            Map<String, String> tokens = authsService.userLogin(loginReqDto);

            // ✅ JSON 응답
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");

            String jsonResponse = new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(tokens);
            response.getWriter().write(jsonResponse);

            response.sendRedirect("http://localhost:5173/");
        }else{
            response.sendRedirect("http://localhost:5173/kakao-login");
        }

    }
}
