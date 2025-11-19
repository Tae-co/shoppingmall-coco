package com.shoppingmallcoco.project.service;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import com.shoppingmallcoco.project.entity.product.ProductEntity;

// 이 파일은 임시 테스트용
@Service
public class MockReviewService implements IReviewService {
    
    @Override
    public int getReviewCount(ProductEntity product) {
        // 1 ~ 1000개 사이 랜덤 리뷰 수
        return (int) (Math.random() * 1000 + 1); 
    }

    @Override
    public double getAverageRating(ProductEntity product) {
        // 3.0 ~ 5.0 사이 랜덤 평점
        double randomRating = (Math.random() * 2.0 + 3.0);
        // 소수점 둘째 자리까지 반올림
        return Math.round(randomRating * 100.0) / 100.0;
    }
}