package com.shoppingmallcoco.project.dto.product;

import java.util.List;
import java.util.stream.Collectors;

import com.shoppingmallcoco.project.dto.product.ProductOptionDTO;
import com.shoppingmallcoco.project.entity.product.ProductEntity;
import com.shoppingmallcoco.project.entity.product.ProductImageEntity;

import lombok.Data;
import java.util.Collections;

@Data
public class ProductDetailResponseDTO {

	private Long prdNo;
    private String prdName;
    private int prdPrice;
    private String description;
    private String howToUse;
    private List<String> imageUrls;
    private double averageRating; 
    private int reviewCount;
    
    // 옵션 목록 (ProductOption -> DTO 변환 로직 필요)
    private List<ProductOptionDTO> options;
    
    // 생성자: Entity -> DTO 변환
    public ProductDetailResponseDTO(ProductEntity product) {
    	this.prdNo = product.getPrdNo();
        this.prdName = product.getPrdName();
        this.prdPrice = product.getPrdPrice();
        this.description = product.getDescription();
        this.howToUse = product.getHowToUse();
    	
    	// Entity의 List<ProductImageEntity>를 List<String> (URL 목록)으로 변환
        if (product.getImages() != null) {
            this.imageUrls = product.getImages().stream()
                                    .map(ProductImageEntity::getImageUrl) // (image -> image.getImageUrl())
                                    .collect(Collectors.toList());
        } else {
            this.imageUrls = Collections.emptyList();
        }
        
        // (임시) 리뷰 통계
        double randomRating = (Math.random() * 2.0 + 3.0);
        this.averageRating = Math.round(randomRating * 100.0) / 100.0; 
        this.reviewCount = (int) (Math.random() * 1000 + 1);
        
        // 상품 옵션 변환 로직
        if (product.getOptions() != null) {
            this.options = product.getOptions().stream()
                                    .map(ProductOptionDTO::new)
                                    .collect(Collectors.toList());
        } else {
            this.options = Collections.emptyList();
        }
    }
}
