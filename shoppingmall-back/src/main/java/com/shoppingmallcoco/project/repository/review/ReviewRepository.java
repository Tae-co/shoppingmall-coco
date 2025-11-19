package com.shoppingmallcoco.project.repository.review;

import com.shoppingmallcoco.project.entity.review.Review;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // review 등록, // review 수정한 내용 Update
    //Review save(Review review);

    // review 1개 조회 (수정하기 위해서)
    //Optional<Review> findById(Long reviewNo);

    // review 모든 목록 조회 (하나의 상품에 등록된 리뷰 목록 조회)
    List<Review> findByOrderItem_PrdNo(Long prdNo);

    // review 삭제
    //void deleteById(Long reviewNo);
}
