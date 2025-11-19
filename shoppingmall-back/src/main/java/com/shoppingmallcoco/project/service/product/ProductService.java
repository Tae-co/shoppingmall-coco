package com.shoppingmallcoco.project.service.product;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.io.File;
import java.io.IOException;
import java.util.UUID;
import org.springframework.web.multipart.MultipartFile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;

import com.shoppingmallcoco.project.dto.product.ProductAdminRequestDTO;
import com.shoppingmallcoco.project.entity.product.CategoryEntity;
import com.shoppingmallcoco.project.entity.product.ProductEntity;
import com.shoppingmallcoco.project.entity.product.ProductImageEntity;
import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
import com.shoppingmallcoco.project.repository.product.CategoryRepository;
import com.shoppingmallcoco.project.repository.product.ProductImageRepository;
import com.shoppingmallcoco.project.repository.product.ProductOptionRepository;
import com.shoppingmallcoco.project.repository.product.ProductRepository;
import com.shoppingmallcoco.project.service.IReviewService;

@Service
public class ProductService {

	@Autowired
	private ProductRepository prdRepo;

	@Autowired
	private IReviewService reviewService;

	@Autowired
	private CategoryRepository catRepo;

	@Autowired
	private ProductImageRepository prdImgRepo;

	@Autowired
	private ProductOptionRepository prdOptRepo;

	private final String uploadDir = "C:/product_images/";

	// 상품 상세 조회
	@Transactional(readOnly = true)
	public ProductEntity getProductDetail(Long prdNo) {
		ProductEntity product = prdRepo.findById(prdNo).orElse(null);

		if (product != null) {
			product.getOptions().size();
			product.getImages().size();
		}

		return product;
	}

	public Page<ProductEntity> getProductList(String q, List<String> skinType, List<String> skinConcern,
			List<String> personalColor, Long categoryNo, String status, String sort, int page, int size) {

		// 정렬
		Sort sortObj;

		switch (sort) {
		case "newest":
			sortObj = Sort.by("regDate").descending();
			break;
		case "priceAsc":
			sortObj = Sort.by("prdPrice").ascending();
			break;
		case "priceDesc":
			sortObj = Sort.by("prdPrice").descending();
			break;
		case "popularity":
		default:
			sortObj = Sort.by("regDate").descending();
			break;
		}

		// 페이지네이션 로직
		Pageable pageable = PageRequest.of(page - 1, size, sortObj);

		// 동적 쿼리
		Specification<ProductEntity> spec = (root, query, cb) -> {
			List<Predicate> predicates = new ArrayList<>();

			// 검색어(q) 필터
			if (q != null && !q.isEmpty()) {
				predicates.add(cb.like(root.get("prdName"), "%" + q + "%"));
			}

			// skinType 필터
			if (skinType != null && !skinType.isEmpty()) {
				List<Predicate> skinTypePredicates = new ArrayList<>();
				if (!skinType.contains("all")) {
					for (String type : skinType) {
						// SKINTYPE 컬럼의 OR 조건
						skinTypePredicates.add(cb.like(root.get("skinType"), "%" + type + "%"));
					}
					predicates.add(cb.or(skinTypePredicates.toArray(new Predicate[0])));
				}
			}

			// skinConcern 필터
			if (skinConcern != null && !skinConcern.isEmpty()) {
				List<Predicate> concernPredicates = new ArrayList<>();
				for (String concern : skinConcern) {
					concernPredicates.add(cb.like(root.get("skinConcern"), "%" + concern + "%"));
				}
				predicates.add(cb.or(concernPredicates.toArray(new Predicate[0])));
			}

			// personalColor 필터
			if (personalColor != null && !personalColor.isEmpty()) {
				List<Predicate> colorPredicates = new ArrayList<>();
				for (String color : personalColor) {
					colorPredicates.add(cb.like(root.get("personalColor"), "%" + color + "%"));
				}
				predicates.add(cb.or(colorPredicates.toArray(new Predicate[0])));
			}

			// 카테고리 필터
			if (categoryNo != null && categoryNo > 0) {
				// product.category.categoryNo = ?
				predicates.add(cb.equal(root.get("category").get("categoryNo"), categoryNo));
			}

			// 상태 필터 (판매중/품절)
			if (status != null && !status.isEmpty()) {
				predicates.add(cb.equal(root.get("status"), status));
			}

			return cb.and(predicates.toArray(new Predicate[0]));
		};

		return prdRepo.findAll(spec, pageable);
	}

	public int getReviewCount(ProductEntity product) {
		return reviewService.getReviewCount(product);
	}

	public double getAverageRating(ProductEntity product) {
		return reviewService.getAverageRating(product);
	}

	/**
	 * API: 관리자 상품 등록
	 */
	@Transactional
	public ProductEntity createProduct(ProductAdminRequestDTO dto, MultipartFile file) throws IOException {

		CategoryEntity category = catRepo.findById(dto.getCategoryNo())
				.orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다: " + dto.getCategoryNo()));

		ProductEntity newProduct = new ProductEntity();
		newProduct.setPrdName(dto.getPrdName());
		newProduct.setPrdPrice(dto.getPrdPrice());
		newProduct.setDescription(dto.getDescription());
		newProduct.setRegDate(LocalDate.now());
		newProduct.setCategory(category);
		newProduct.setHowToUse(dto.getHowToUse());
        newProduct.setSkinType(dto.getSkinType());
        newProduct.setSkinConcern(dto.getSkinConcern());
        newProduct.setPersonalColor(dto.getPersonalColor());
		
		if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            newProduct.setStatus(dto.getStatus());
        } else {
            newProduct.setStatus("SALE");
        }

		ProductEntity savedProduct = prdRepo.save(newProduct);

		ProductOptionEntity newOption = new ProductOptionEntity();
		newOption.setProduct(savedProduct);
		newOption.setOptionName("기본");
		newOption.setOptionValue(dto.getPrdName());
		newOption.setStock(dto.getStock());
		newOption.setAddPrice(0);
		prdOptRepo.save(newOption);

		String savedFileName = null;
		if (file != null && !file.isEmpty()) {
			String originalFileName = file.getOriginalFilename();
			String uuid = UUID.randomUUID().toString();
			savedFileName = uuid + "_" + originalFileName;

			File dest = new File(uploadDir, savedFileName);
			file.transferTo(dest);

			ProductImageEntity newImage = new ProductImageEntity();
			newImage.setProduct(savedProduct);
			newImage.setImageUrl(savedFileName);
			newImage.setSortOrder(1);
			prdImgRepo.save(newImage);
		}

		return savedProduct;
	}

	/**
	 * API: 관리자 상품 수정
	 */
	@Transactional
	public ProductEntity updateProduct(Long prdNo, ProductAdminRequestDTO dto, MultipartFile file) throws IOException {
		// 기존 상품 조회
		ProductEntity product = prdRepo.findById(prdNo)
				.orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다: " + prdNo));

		// 카테고리 변경
		if (!product.getCategory().getCategoryNo().equals(dto.getCategoryNo())) {
			CategoryEntity newCategory = catRepo.findById(dto.getCategoryNo())
					.orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));
			product.setCategory(newCategory);
		}

		// 기본 정보 수정
		product.setPrdName(dto.getPrdName());
		product.setPrdPrice(dto.getPrdPrice());
		product.setDescription(dto.getDescription());
		product.setHowToUse(dto.getHowToUse());
        product.setSkinType(dto.getSkinType());
        product.setSkinConcern(dto.getSkinConcern());
        product.setPersonalColor(dto.getPersonalColor());
		
		// 상태 수정
		if (dto.getStatus() != null && !dto.getStatus().isEmpty()) {
            product.setStatus(dto.getStatus());
        }

		// 재고 수정 로직
		List<ProductOptionEntity> options = product.getOptions();
        if (options != null && !options.isEmpty()) {
            ProductOptionEntity defaultOption = options.get(0);
            defaultOption.setStock(dto.getStock());
        }
        
        // 이미지 수정
		if (file != null && !file.isEmpty()) {
			String originalFileName = file.getOriginalFilename();
			String uuid = UUID.randomUUID().toString();
			String savedFileName = uuid + "_" + originalFileName;
			File dest = new File(uploadDir, savedFileName);
			file.transferTo(dest);

			// 기존 이미지 업데이트
			List<ProductImageEntity> images = product.getImages();
			ProductImageEntity targetImage;

			if (images != null && !images.isEmpty()) {
				targetImage = images.get(0);
			} else {
				targetImage = new ProductImageEntity();
				targetImage.setProduct(product);
				targetImage.setSortOrder(1);
			}

			targetImage.setImageUrl(savedFileName);
			prdImgRepo.save(targetImage);
		}

		return product;
	}

	/**
	 * API: 관리자 상품 삭제
	 */
	@Transactional
	public void deleteProduct(Long prdNo) {
		prdRepo.deleteById(prdNo);
	}
}
