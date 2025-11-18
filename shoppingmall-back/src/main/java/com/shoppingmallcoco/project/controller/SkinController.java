package com.shoppingmallcoco.project.controller;

import com.shoppingmallcoco.project.dto.mypage.SkinProfileRequestDto;
import com.shoppingmallcoco.project.service.mypage.SkinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/members")
public class SkinController {

    private final SkinService skinService;

    // 피부 프로필 조회
    @GetMapping("/{memNo}/skin-profile")
    public ResponseEntity<?> getSkinProfile(@PathVariable Long memNo) {
        return ResponseEntity.ok(skinService.getProfile(memNo));
    }

    // 피부 프로필 저장
    @PostMapping("/{memNo}/skin-profile")
    public ResponseEntity<?> saveSkinProfile(
            @PathVariable Long memNo,
            @RequestBody SkinProfileRequestDto dto
    ) {
        skinService.saveOrUpdate(memNo, dto);
        return ResponseEntity.ok("피부 프로필이 저장되었습니다.");
    }
}
