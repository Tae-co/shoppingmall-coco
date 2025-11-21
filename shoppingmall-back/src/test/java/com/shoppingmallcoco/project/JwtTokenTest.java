package com.shoppingmallcoco.project;

import com.shoppingmallcoco.project.util.JwtUtil;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class JwtTokenTest {

    @Autowired
    private JwtUtil jwtUtil;

    @Test
    void generateTestToken() {
        // DB에 있는 테스트 계정 정보 (아이디: tester, 번호: 1)
        String memId = "tester";
        Long memNo = 1L;

        // 토큰 생성 (유효기간 등은 JwtUtil 설정 따름)
        String token = jwtUtil.generateToken(memId, memNo);

        System.out.println("\n========== [아래 토큰을 복사하세요] ==========");
        System.out.println(token);
        System.out.println("============================================\n");
    }
}