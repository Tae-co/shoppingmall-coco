package com.shoppingmallcoco.project.repository.review;

import com.shoppingmallcoco.project.entity.review.Review;
import com.shoppingmallcoco.project.entity.review.ReviewTagMap;
import com.shoppingmallcoco.project.entity.review.Tag;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewTagMapRepository extends JpaRepository<ReviewTagMap, Long> {

    List<ReviewTagMap> findByReview(Review review);
}
