package com.shoppingmallcoco.project.dto.review;

import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.review.Review;
import com.shoppingmallcoco.project.entity.review.ReviewLike;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LikeDTO {

    private Long likeNo;
    private Long memNo; // 회원번호
    private Long reviewNo; // 리뷰 번호

    public static LikeDTO toDto(ReviewLike entity) {
        return LikeDTO.builder().likeNo(entity.getLikeNo()).memNo(entity.getMember().getMemNo())
            .reviewNo(entity.getReview().getReviewNo())
            .build();
    }
}
