package com.shoppingmallcoco.project.dto;

import java.util.List;

import com.shoppingmallcoco.project.entity.ProductEntity;

import lombok.Data;

@Data
public class ProductListDTO {
	private Integer prdNo;
	private String prdName;
	private int prdPrice;
	private String imageUrl;
	private double averageRating;
	private int reviewCount;
	private List<String> skinTypes;
	private String simpleReview;
	
	// Entity -> DTO 변환 생성자
	public ProductListDTO(ProductEntity product) {
		this.prdNo = product.getPrdNo();
		this.prdName = product.getPrdName();
		this.prdPrice = product.getPrdPrice();
		this.imageUrl = product.getImageUrl();
		
		// 리뷰 통계 및 태그 로직 추가 필요
		this.averageRating = 4.5;
		this.reviewCount = (int) (Math.random() * 1000);
		this.simpleReview = "임시 리뷰입니다...";
		this.skinTypes = List.of("dry", "sensitive");
	}
}
