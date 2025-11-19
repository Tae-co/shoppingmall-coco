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

    // 프로필 조회
    public ProfileDTO getProfile(Long currentMemNo, Long targetMemNo) {
    	
    	/* 팔로잉 팔로워 수 및 목록 */
        Member member = memberRepository.findById(targetMemNo)
                .orElseThrow(() -> new RuntimeException("회원이 존재하지 않습니다."));

        List<FollowInfoDTO> followers = followRepository.findFollowerInfo(targetMemNo);
        List<FollowInfoDTO> followings = followRepository.findFollowingInfo(targetMemNo);
        
        int followerCount = followers.size();
        int followingCount = followings.size();

        /* 현재 로그인 사용자 확인 */
        boolean isMine = currentMemNo.equals(targetMemNo);
        
        /* 내가 작성한 리뷰 목록 */
        List<MyReviewDTO> myReviews = reviewRepository
        		.findByOrderItem_Order_Member_MemNoOrderByCreatedAtDesc(currentMemNo)
                .stream()
                .map(review -> {
                	var orderItem = review.getOrderItem();
                	var product = orderItem.getProduct();
                	var option = orderItem.getProductOption();
                
                	List<String> tags = review.getReviewTagMaps().stream()
                		.map(map -> map.getTag().getTagName())
                		.toList();
                		
                	int likeCount = likeRepository.countByReview_ReviewNo(review.getReviewNo());
                	
                	return MyReviewDTO.builder()
                		.reviewNo(review.getReviewNo())
                        .productNo(product.getPrdNo())
                        .productName(product.getPrdName())
                        .productOption(option != null ? option.getOptionName() : null)
                        .rating(review.getRating())
                        .createdAt(review.getCreatedAt())
                        .tags(tags)
                        .content(review.getContent())
                        .likeCount(likeCount)
                        .build();
                })
                .toList();
        
        /* 좋아요 누른 리뷰 목록 */
        List<LikedReviewDTO> likedReviews = likeRepository.findByMember_MemNo(currentMemNo)
        		.stream()
        		.map(like -> {
        			var review = like.getReview();
        			var orderItem = review.getOrderItem();
        			var product = orderItem.getProduct();
        			var option = orderItem.getProductOption();
        			
        			List<String> tags = review.getReviewTagMaps()
        					.stream()
        					.map(map -> map.getTag().getTagName())
        					.toList();
        			
        			int likeCount = likeRepository.countByReview_ReviewNo(review.getReviewNo());
        			var reviewMember = orderItem.getOrder().getMember();
        			
        			return LikedReviewDTO.builder()
        					.reviewNo(review.getReviewNo())
                            .productNo(product.getPrdNo())
                            .productName(product.getPrdName())
                            .productOption(option != null ? option.getOptionName() : null)
                            .rating(review.getRating())
                            .createdAt(review.getCreatedAt())
                            .tags(tags)
                            .content(review.getContent())
                            .likeCount(likeCount)
                            .memNo(reviewMember.getMemNo())
                            .memNickname(reviewMember.getMemNickname())
                            .build();
        		})
        		.toList();
        
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
    
    /* 팔로우 */
    public void follow(Long followerNo, Long followingNo) {
        if(followerNo.equals(followingNo)) {
            throw new RuntimeException("자기 자신을 팔로우할 수 없습니다.");
        }

        boolean exists = followRepository.existsByFollowerMemNoAndFollowingMemNo(followerNo, followingNo);
        if(exists) {
            throw new RuntimeException("이미 팔로우 중입니다.");
        }

        Member follower = memberRepository.findById(followerNo)
                .orElseThrow(() -> new RuntimeException("팔로워 회원이 존재하지 않습니다."));
        Member following = memberRepository.findById(followingNo)
                .orElseThrow(() -> new RuntimeException("팔로잉 회원이 존재하지 않습니다."));

        Follow follow = Follow.builder()
                .follower(follower)
                .following(following)
                .build();

        followRepository.save(follow);
    }

    /* 언팔로우 */
    public void unfollow(Long followerNo, Long followingNo) {
        boolean exists = followRepository.existsByFollowerMemNoAndFollowingMemNo(followerNo, followingNo);
        if(!exists) {
            throw new RuntimeException("팔로우하지 않은 사용자입니다.");
        }

        followRepository.deleteByFollowerMemNoAndFollowingMemNo(followerNo, followingNo);
    }
}
