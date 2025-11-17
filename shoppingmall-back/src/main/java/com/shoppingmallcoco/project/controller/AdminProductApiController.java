package com.shoppingmallcoco.project.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shoppingmallcoco.project.dto.product.ProductAdminRequestDTO;
import com.shoppingmallcoco.project.dto.product.ProductDetailResponseDTO;
import com.shoppingmallcoco.project.entity.product.ProductEntity;
import com.shoppingmallcoco.project.service.product.ProductService;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/admin")
public class AdminProductApiController {
	
	@Autowired
	private ProductService prdService;
	
	/**
     * API: 관리자 상품 등록
     * POST /api/admin/products
     */

	@PostMapping("/products")
	public ResponseEntity<ProductDetailResponseDTO> createProduct(
            @RequestPart("dto") ProductAdminRequestDTO requestDTO,
            @RequestPart("imageFile") MultipartFile file
    ) throws IOException { 
		
		ProductEntity createdProduct = prdService.createProduct(requestDTO, file);
        
		int reviewCount = prdService.getReviewCount(createdProduct);
        double averageRating = prdService.getAverageRating(createdProduct);
        
        ProductDetailResponseDTO responseDTO = new ProductDetailResponseDTO(createdProduct, reviewCount, averageRating);
        
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }
}
