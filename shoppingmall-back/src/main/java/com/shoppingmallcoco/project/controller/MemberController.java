package com.shoppingmallcoco.project.controller;

import com.shoppingmallcoco.project.dto.FindIdDto;
import com.shoppingmallcoco.project.dto.MemberLoginDto;
import com.shoppingmallcoco.project.dto.MemberResponseDto;
import com.shoppingmallcoco.project.dto.MemberSignupDto;
import com.shoppingmallcoco.project.dto.ResetPasswordDto;
import com.shoppingmallcoco.project.service.EmailVerificationService;
import com.shoppingmallcoco.project.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {

    private final MemberService memberService;
    private final EmailVerificationService emailVerificationService;

    // 회원가입
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody MemberSignupDto signupDto) {
        try {
            MemberResponseDto response = memberService.signup(signupDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
    }


    // 아이디 중복 확인
    @GetMapping("/check-id/{memId}")
    public ResponseEntity<Map<String, Object>> checkIdDuplicate(@PathVariable String memId) {
        boolean isDuplicate = memberService.checkIdDuplicate(memId);
        Map<String, Object> response = new HashMap<>();
        response.put("available", !isDuplicate);
        response.put("message", isDuplicate ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다.");
        return ResponseEntity.ok(response);
    }

    // 닉네임 중복 확인
    @GetMapping("/check-nickname/{memNickname}")
    public ResponseEntity<Map<String, Object>> checkNicknameDuplicate(@PathVariable String memNickname) {
        boolean isDuplicate = memberService.checkNicknameDuplicate(memNickname);
        Map<String, Object> response = new HashMap<>();
        response.put("available", !isDuplicate);
        response.put("message", isDuplicate ? "이미 사용 중인 닉네임입니다." : "사용 가능한 닉네임입니다.");
        return ResponseEntity.ok(response);
    }

    // 이메일 중복 확인
    @GetMapping("/check-email/{memMail}")
    public ResponseEntity<Map<String, Object>> checkEmailDuplicate(@PathVariable String memMail) {
        boolean isDuplicate = memberService.checkEmailDuplicate(memMail);
        Map<String, Object> response = new HashMap<>();
        response.put("available", !isDuplicate);
        response.put("message", isDuplicate ? "이미 사용 중인 이메일입니다." : "사용 가능한 이메일입니다.");
        return ResponseEntity.ok(response);
    }


}


