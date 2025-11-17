package com.shoppingmallcoco.project.repository.review;

import com.shoppingmallcoco.project.entity.review.Review;
import com.shoppingmallcoco.project.entity.review.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<ReviewLike,Long> {
    int countByReview(Review review);
}
