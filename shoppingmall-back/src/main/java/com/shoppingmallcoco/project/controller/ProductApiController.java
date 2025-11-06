package com.shoppingmallcoco.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import com.shoppingmallcoco.project.dto.ProductDetailResponseDTO;
import com.shoppingmallcoco.project.dto.ProductListResponseDTO;
import com.shoppingmallcoco.project.entity.ProductEntity;
import com.shoppingmallcoco.project.service.ProductService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
public class ProductApiController {
	
	@Autowired
	private ProductService prdService;
	
	/**
     * API: 상품 목록 조회
     * GET /api/products
     */
	
	@GetMapping("/products")
	public ProductListResponseDTO getProductList(
			@RequestParam(value = "q",required = false) String q,
			@RequestParam(value = "skinType", required = false) List<String> skinType,
			@RequestParam(value = "skinConcern", required = false) List<String> skinConcern,
			@RequestParam(value = "sort", required = false, defaultValue = "popularity") String sort,
			@RequestParam(value = "page", required = false, defaultValue = "1") int page,
			@RequestParam(value = "size", required = false, defaultValue = "6") int size
			) {
				// Service 호출
				Page<ProductEntity> productPage = prdService.getProductList(q, skinType, skinConcern, sort, page, size);
				
				// page -> DTO 변환
				return new ProductListResponseDTO(productPage);
						
	}
	
}
