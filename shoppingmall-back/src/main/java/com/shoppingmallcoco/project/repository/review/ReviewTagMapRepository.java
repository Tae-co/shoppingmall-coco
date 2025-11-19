package com.shoppingmallcoco.project.repository.review;

import com.shoppingmallcoco.project.entity.review.Review;
import com.shoppingmallcoco.project.entity.review.ReviewTagMap;
import com.shoppingmallcoco.project.entity.review.Tag;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewTagMapRepository extends JpaRepository<ReviewTagMap, Long> {

    List<ReviewTagMap> findByReview(Review review);

    // 특정 상품, 특정 피부타입에 대한 총 리뷰 수 찾기

    // 특정 상품, 특정 피부타입인 리들의 태그별 개수 구하기 상위 3개만
}
