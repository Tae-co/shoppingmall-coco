package com.shoppingmallcoco.project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shoppingmallcoco.project.dto.comate.ProfileDTO;
import com.shoppingmallcoco.project.service.comate.ComateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/comate")
@RequiredArgsConstructor
public class ComateController {

    private final ComateService comateService;

    // 프로필 조회
    @GetMapping("/user/{memNo}")
    public ProfileDTO getProfile(@PathVariable("memNo") Long memNo) {
        Long currentMemNo = 1L; // 테스트용
        return comateService.getProfile(currentMemNo, memNo);
    }

    // 팔로우
    @PostMapping("/follow/{targetMemNo}")
    public ResponseEntity<String> follow(@RequestParam Long currentMemNo, @PathVariable Long targetMemNo) {
        comateService.follow(currentMemNo, targetMemNo);
        return ResponseEntity.ok("팔로우 완료");
    }

    // 언팔로우
    @DeleteMapping("/unfollow/{targetMemNo}")
    public ResponseEntity<String> unfollow(@RequestParam Long currentMemNo, @PathVariable Long targetMemNo) {
        comateService.unfollow(currentMemNo, targetMemNo);
        return ResponseEntity.ok("언팔로우 완료");
    }

}
