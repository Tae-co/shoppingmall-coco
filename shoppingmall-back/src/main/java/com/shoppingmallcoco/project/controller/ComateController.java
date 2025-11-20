package com.shoppingmallcoco.project.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shoppingmallcoco.project.dto.comate.FollowInfoDTO;
import com.shoppingmallcoco.project.dto.comate.LikedReviewDTO;
import com.shoppingmallcoco.project.dto.comate.MiniProfileDTO;
import com.shoppingmallcoco.project.dto.comate.MyReviewDTO;
import com.shoppingmallcoco.project.dto.comate.ProfileDTO;
import com.shoppingmallcoco.project.service.comate.CM_ReviewService;
import com.shoppingmallcoco.project.service.comate.ComateService;
import com.shoppingmallcoco.project.service.comate.FollowService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/comate")
@RequiredArgsConstructor
public class ComateController {

    private final ComateService comateService;
    private final FollowService followService;
    private final CM_ReviewService reviewService;

    // 프로필 조회
    @GetMapping("/user/{memNo}")
    public ProfileDTO getProfile(@PathVariable("memNo") Long memNo) {
        Long currentMemNo = 1L; // 테스트용
        return comateService.getProfile(currentMemNo, memNo);
    }
/*
    @GetMapping("/{targetMemNo}")
    public ProfileDTO getProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long targetMemNo) {

        Long currentMemNo = user.getMemNo();

        return profileService.getProfileBasic(currentMemNo, targetMemNo);
    }
*/

    // 팔로워 목록 조회
    @GetMapping("/follow/followers/{memNo}")
    public List<FollowInfoDTO> getFollowers(@PathVariable("memNo") Long memNo) {
    	return followService.getFollowers(memNo);
    }
    
    // 팔로잉 목록 조회
    @GetMapping("/follow/followings/{memNo}")
    public List<FollowInfoDTO> getFollowings(@PathVariable("memNo") Long memNo) {
    	return followService.getFollowings(memNo);
    }

    // 팔로우
    @PostMapping("/follow/{targetMemNo}")
    public ResponseEntity<String> follow(@RequestParam Long currentMemNo, @PathVariable Long targetMemNo) {
        followService.follow(currentMemNo, targetMemNo);
        return ResponseEntity.ok("팔로우 완료");
    }

    // 언팔로우
    @DeleteMapping("/unfollow/{targetMemNo}")
    public ResponseEntity<String> unfollow(@RequestParam Long currentMemNo, @PathVariable Long targetMemNo) {
        followService.unfollow(currentMemNo, targetMemNo);
        return ResponseEntity.ok("언팔로우 완료");
    }
    
    // 사용자가 작성한 리뷰 목록
    @GetMapping("/review/{memNo}")
    public List<MyReviewDTO> getMyReviews(@PathVariable("memNo") Long memNo) {
        return reviewService.getMyReviews(memNo);
    }
    
    // 사용자가 좋아요 누른 리뷰 목록
    @GetMapping("/like/{memNo}")
    public List<LikedReviewDTO> getLikedReviews(@PathVariable("memNo") Long memNo) {
        return reviewService.getLikedReviews(memNo);
    }

    // 메인용 - 전체 회원 목록 조회
    @GetMapping("/users")
    public ResponseEntity<List<MiniProfileDTO>> getAllComates() {
    	return ResponseEntity.ok(comateService.getAllComates());
    }
}
