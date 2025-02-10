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
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequiredArgsConstructor
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final AuthsService authsService;
    private static final String URI = "/auths/user-login";

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {

        System.out.println("일단 여기 까지 도착");
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getAttribute("email");
        String nickname = oAuth2User.getAttribute("nickname");
        String profileImage = oAuth2User.getAttribute("profile_image");

        System.out.println("OAuth 로그인 성공: email=" + email + ", nickname=" + nickname);

        // 회원 여부 확인
        Optional<User> user = userRepository.findByEmail(email);

        String redirectUrl;

        if (user.isPresent()) {

            Map<String, String> tokens = authsService.userLogin(LoginReqDto.kakaoLogin(email));
            String encodedAccessToken = URLEncoder.encode(tokens.get("access_token"), StandardCharsets.UTF_8);
            String encodedRefreshToken = URLEncoder.encode(tokens.get("access_token"), StandardCharsets.UTF_8);

            redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/")
                    .queryParam("access_token", encodedAccessToken)
                    .queryParam("refresh_token", encodedRefreshToken)
                    .build()
                    .toUriString();

//            redirectUrl = "http://localhost:5173/";

        } else {

            String encodedEmail = URLEncoder.encode(email, StandardCharsets.UTF_8);
            String encodedNickname = URLEncoder.encode(nickname, StandardCharsets.UTF_8);

            redirectUrl = UriComponentsBuilder.fromUriString("http://localhost:5173/kakao-login")
                    .queryParam("email", encodedEmail)
                    .queryParam("nickname", encodedNickname)
                    .build()
                    .toUriString();
        }


        System.out.println("✅ 리다이렉트 URL: " + redirectUrl);

        if (!response.isCommitted()) { // ✅ 응답이 이미 전송되었는지 체크
            response.sendRedirect(redirectUrl);
            System.out.println("✅ response.sendRedirect() 호출 완료");
        } else {
            System.out.println("❌ 응답이 이미 커밋되어 sendRedirect() 실행 불가!");
        }
    }
}
