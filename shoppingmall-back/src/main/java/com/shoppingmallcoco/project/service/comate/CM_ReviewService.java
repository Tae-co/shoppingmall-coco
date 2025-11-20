package com.shoppingmallcoco.project.service.comate;

import java.util.List;

import org.springframework.stereotype.Service;

import com.shoppingmallcoco.project.dto.comate.LikedReviewDTO;
import com.shoppingmallcoco.project.dto.comate.MyReviewDTO;
import com.shoppingmallcoco.project.repository.review.LikeRepository;
import com.shoppingmallcoco.project.repository.review.ReviewRepository;

import lombok.*;

@Service
@RequiredArgsConstructor
public class CM_ReviewService {

    private final ReviewRepository reviewRepository;
    private final LikeRepository likeRepository;

    /* 사용자가 작성한 리뷰 목록 */
    public List<MyReviewDTO> getMyReviews(Long memNo) {
    	return reviewRepository.findByOrderItem_Order_Member_MemNoOrderByCreatedAtDesc(memNo)
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
    }

    /* 사용자가 좋아요 누른 리뷰 목록 */
    public List<LikedReviewDTO> getLikedReviews(Long memNo) {
        return likeRepository.findByMember_MemNo(memNo)
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
    }
}
