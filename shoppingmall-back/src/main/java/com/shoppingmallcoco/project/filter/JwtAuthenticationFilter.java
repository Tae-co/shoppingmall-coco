package com.shoppingmallcoco.project.filter;

import com.shoppingmallcoco.project.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    /**
     * 매 요청을 가로채 JWT를 검증하고, 유효하다면 SecurityContext에 인증 정보를 저장한다.
     * OncePerRequestFilter를 상속했기 때문에 요청 당 한 번만 실행된다.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Authorization 헤더에서 토큰 추출 (예: "Bearer x.y.z")
        String token = getTokenFromRequest(request);

        // 토큰이 존재하고 검증에 성공하면 사용자 정보를 꺼내 인증 객체를 구성한다.
        if (token != null && jwtUtil.validateToken(token)) {
            String memId = jwtUtil.getMemIdFromToken(token);
            Long memNo = jwtUtil.getMemNoFromToken(token);

            if (memId != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // 현재 토큰에는 역할(role)에 대한 추가 정보가 없어 기본 USER 권한만 부여한다.
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        memId,
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"))
                );
                // 인증 객체에 요청 세부 정보를 포함시켜 이후 감사 로그 등에 활용 가능하도록 한다.
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }

    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}


