package com.shoppingmallcoco.project.service.comate;

import org.springframework.stereotype.Service;

import com.shoppingmallcoco.project.dto.comate.ProfileDTO;
import com.shoppingmallcoco.project.entity.Member;
import com.shoppingmallcoco.project.repository.MemberRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ComateService {

	private final MemberRepository memberRepository;
	
	public ProfileDTO getProfile(Long profileMemNo, Long currentMemNo) {
		Member member = memberRepository.findById(profileMemNo)
				.orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));
		
		// 내 프로필인지 체크
		boolean isMine = profileMemNo.equals(currentMemNo);
		
		return ProfileDTO.builder()
				.memNo(member.getMemNo())
				.memName(member.getMemName())
				.memNickname(member.getMemNickname())
				.isMyProfile(isMine)
				.build();
	}
 }
