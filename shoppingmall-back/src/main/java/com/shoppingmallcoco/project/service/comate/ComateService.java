package com.shoppingmallcoco.project.service.comate;

import com.shoppingmallcoco.project.dto.comate.FollowInfoDTO;
import com.shoppingmallcoco.project.dto.comate.ProfileDTO;
import com.shoppingmallcoco.project.entity.Member;
import com.shoppingmallcoco.project.repository.MemberRepository;
import com.shoppingmallcoco.project.repository.comate.FollowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComateService {

    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;

    public ProfileDTO getProfile(Long currentMemNo, Long targetMemNo) {

        Member member = memberRepository.findById(targetMemNo)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        List<FollowInfoDTO> followers = followRepository.findFollowerInfo(targetMemNo);
        List<FollowInfoDTO> followings = followRepository.findFollowingInfo(targetMemNo);
        
        int followerCount = followers.size();
        int followingCount = followings.size();

        boolean isMine = currentMemNo.equals(targetMemNo);
        
        System.out.println("현재 사용자: " + currentMemNo);
        System.out.println("타겟 사용자: " + targetMemNo);
        System.out.println("팔로워: " + followers.size());
        System.out.println("팔로잉: " + followings.size());

        return ProfileDTO.builder()
                .memNo(member.getMemNo())
                .memName(member.getMemName())
                .memNickname(member.getMemNickname())
                .followerCount(followerCount)
                .followingCount(followingCount)
                .isMyProfile(isMine)
                .followers(followers)
                .followings(followings)
                .build();
    }
}
