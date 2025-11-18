package com.shoppingmallcoco.project.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoppingmallcoco.project.dto.comate.ProfileDTO;
import com.shoppingmallcoco.project.service.EmailVerificationService;
import com.shoppingmallcoco.project.service.comate.ComateService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/comate")
@RequiredArgsConstructor
public class ComateController {

	private final ComateService comateService;
	
	//  프로필 조회
	@GetMapping("/me/profile")
	public ProfileDTO getMyProfile() {
		Long currentMemNo = 1L;
		return comateService.getProfile(currentMemNo, currentMemNo);
	}
	
	// 다른 사용자 프로필 조회
	@GetMapping("/user/{memNo}/profile")
	public ProfileDTO getUserProfile(@PathVariable("memNo") Long memNo) {
		Long currentMemNo = 1L;
		return comateService.getProfile(memNo, currentMemNo);
	}
 }
