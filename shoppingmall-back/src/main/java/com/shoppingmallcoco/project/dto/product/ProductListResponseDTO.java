package com.shoppingmallcoco.project.dto.product;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

import com.shoppingmallcoco.project.entity.product.ProductEntity;

import lombok.Data;

@Data
public class ProductListResponseDTO {
	private int totalPages;
	private long totalElements;
	private boolean isLast;
	private int currentPage;
	private List<ProductListDTO> content;
	
	// Page<Entity> -> DTO 변환
	public ProductListResponseDTO(Page<ProductEntity> page) {
		this.totalPages = page.getTotalPages();
		this.totalElements = page.getTotalElements();
		this.isLast = page.isLast();
		this.currentPage = page.getNumber() + 1; // JPA 페이지는 0부터 시작
		this.content = page.getContent().stream()
				.map(ProductListDTO::new)
				.collect(Collectors.toList());
	}
}
