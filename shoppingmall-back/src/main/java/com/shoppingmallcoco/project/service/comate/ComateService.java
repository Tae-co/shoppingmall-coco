package com.shoppingmallcoco.project.service.comate;

import com.shoppingmallcoco.project.dto.comate.FollowInfoDTO;
import com.shoppingmallcoco.project.dto.comate.LikedReviewDTO;
import com.shoppingmallcoco.project.dto.comate.MyReviewDTO;
import com.shoppingmallcoco.project.dto.comate.ProfileDTO;
import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.comate.Follow;
import com.shoppingmallcoco.project.repository.auth.MemberRepository;
import com.shoppingmallcoco.project.repository.comate.FollowRepository;
import com.shoppingmallcoco.project.repository.review.LikeRepository;
import com.shoppingmallcoco.project.repository.review.ReviewRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComateService {

    private final MemberRepository memberRepository;
    private final FollowRepository followRepository;
    private final ReviewRepository reviewRepository;
    private final LikeRepository likeRepository;
    
    private final FollowService followService;
    private final CM_ReviewService reviewService;

    // 프로필 기본 정보 조회
    public ProfileDTO getProfileBasic(Long currentMemNo, Long targetMemNo) {
    	
    	Member member = memberRepository.findById(targetMemNo)
    			.orElseThrow(() -> new RuntimeException("존재하지 않는 회원입니다."));
    	
    	// 팔로워 / 팔로잉 목록
        List<FollowInfoDTO> followers = followService.getFollowers(targetMemNo);
        List<FollowInfoDTO> followings = followService.getFollowings(targetMemNo);

        int followerCount = followers.size();
        int followingCount = followings.size();

        // 본인 프로필인지 여부
        boolean isMine = currentMemNo.equals(targetMemNo);
        
        // 사용자가 작성한 리뷰
        List<MyReviewDTO> myReviews = reviewService.getMyReviews(targetMemNo);
        // 사용자가 좋아요 누른 리뷰 목록
        List<LikedReviewDTO> likedReviews = reviewService.getLikedReviews(currentMemNo);
        
        return ProfileDTO.builder()
                .memNo(member.getMemNo())
                .memName(member.getMemName())
                .memNickname(member.getMemNickname())
                .followerCount(followerCount)
                .followingCount(followingCount)
                .isMyProfile(isMine)
                .followers(followers)
                .followings(followings)
                .myReviews(myReviews)
                .likedReviews(likedReviews)
                .build();
    }
  
}
