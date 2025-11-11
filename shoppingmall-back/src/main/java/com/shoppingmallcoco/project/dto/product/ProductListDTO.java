package com.shoppingmallcoco.project.dto.product;

import java.util.List;
import java.util.Arrays;
import java.util.Collections;
import com.shoppingmallcoco.project.entity.product.ProductEntity;

import lombok.Data;

@Data
public class ProductListDTO {
	private Long prdNo;
	private String prdName;
	private int prdPrice;
	private String imageUrl;
	private double averageRating;
	private int reviewCount;
	private List<String> skinTypes;
	private List<String> skinConcerns;
	private List<String> personalColors;
	private String simpleReview;
	
	// Entity -> DTO 변환 생성자
	public ProductListDTO(ProductEntity product, int reviewCount, double averageRating) {
		this.prdNo = product.getPrdNo();
		this.prdName = product.getPrdName();
		this.prdPrice = product.getPrdPrice();
		
		if (product.getImages() != null && !product.getImages().isEmpty()) {
            this.imageUrl = product.getImages().get(0).getImageUrl();
        } else {
            this.imageUrl = null; // 이미지가 없으면 null
        }
		
		// 리뷰 통계
		this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        
        // 임시 로직
        this.simpleReview = "DB 리뷰 요약... (구현 필요)";

        // 쉼표로 구분된 문자열을 List<String>으로 변환
        if (product.getSkinType() != null && !product.getSkinType().isEmpty()) {
            this.skinTypes = Arrays.asList(product.getSkinType().split("\\s*,\\s*")); // (쉼표와 공백으로 분리)
        } else {
            this.skinTypes = Collections.emptyList();
        }
        
        if (product.getSkinConcern() != null && !product.getSkinConcern().isEmpty()) {
            this.skinConcerns = Arrays.asList(product.getSkinConcern().split("\\s*,\\s*"));
        } else {
            this.skinConcerns = Collections.emptyList();
        }
        
        if (product.getPersonalColor() != null && !product.getPersonalColor().isEmpty()) {
            this.personalColors = Arrays.asList(product.getPersonalColor().split("\\s*,\\s*"));
        } else {
            this.personalColors = Collections.emptyList();
        }
	}
}
