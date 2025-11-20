package com.shoppingmallcoco.project.service.comate;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoppingmallcoco.project.dto.comate.FollowInfoDTO;
import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.comate.Follow;
import com.shoppingmallcoco.project.repository.auth.MemberRepository;
import com.shoppingmallcoco.project.repository.comate.FollowRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;

    /* 팔로워 목록 조회 */
    public List<FollowInfoDTO> getFollowers(Long memNo) {
        return followRepository.findFollowerInfo(memNo);
    }

    /* 팔로잉 목록 조회 */
    public List<FollowInfoDTO> getFollowings(Long memNo) {
        return followRepository.findFollowingInfo(memNo);
    }
    
    /* 팔로우 */
    public void follow(Long followerNo, Long followingNo) {
        if (followerNo.equals(followingNo)) {
        	throw new RuntimeException("자기 자신을 팔로우할 수 없니다. ");
        }
        
        boolean exists = followRepository.existsByFollowerMemNoAndFollowingMemNo(followerNo, followingNo);
        if (exists) {
        	throw new RuntimeException("이미 팔로우 중 입니다.");
        }
        
        Member follower = memberRepository.findById(followerNo)
        		.orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
        Member following = memberRepository.findById(followerNo)
        		.orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
        
        Follow follow = Follow.builder()
        		.follower(follower)
        		.following(following)
        		.build();
        
        followRepository.save(follow);
    }

    /* 언팔로우 */
    public void unfollow(Long followerNo, Long followingNo) {
    	boolean exists = followRepository.existsByFollowerMemNoAndFollowingMemNo(followerNo, followingNo);
        if (!exists) {
            throw new RuntimeException("팔로우하지 않은 사용자입니다.");
        }

        followRepository.deleteByFollowerMemNoAndFollowingMemNo(followerNo, followingNo);
    }

}
