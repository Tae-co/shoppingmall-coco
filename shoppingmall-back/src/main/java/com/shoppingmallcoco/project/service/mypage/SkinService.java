package com.shoppingmallcoco.project.service.mypage;

import com.shoppingmallcoco.project.dto.mypage.SkinProfileRequestDto;
import com.shoppingmallcoco.project.dto.mypage.SkinProfileResponseDto;
import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.mypage.SkinProfile;
import com.shoppingmallcoco.project.repository.auth.MemberRepository;
import com.shoppingmallcoco.project.repository.mypage.SkinRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SkinService {

    private final SkinRepository skinRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public void saveOrUpdate(Long memNo, SkinProfileRequestDto dto) {

        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        SkinProfile profile = skinRepository.findByMember_MemNo(memNo)
                .orElse(SkinProfile.builder().member(member).build());

        profile.setSkinType(dto.getSkinType());
        profile.setSkinConcern(String.join(",", dto.getSkinConcern()));
        profile.setPersonalColor(dto.getPersonalColor());

        skinRepository.save(profile);
    }

    public SkinProfileResponseDto getProfile(Long memNo) {
        return skinRepository.findByMember_MemNo(memNo)
                .map(SkinProfileResponseDto::fromEntity)
                .orElse(null);
    }
}
