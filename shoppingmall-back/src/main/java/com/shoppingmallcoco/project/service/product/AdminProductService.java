package com.shoppingmallcoco.project.service.product;

import com.shoppingmallcoco.project.dto.product.ProductSaveDTO;
import com.shoppingmallcoco.project.entity.product.*;
import com.shoppingmallcoco.project.repository.product.*;
import com.shoppingmallcoco.project.service.review.IReviewService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.ArrayList;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminProductService {

	private final ProductRepository prdRepo;
	private final ProductOptionRepository optionRepo;
	private final CategoryRepository catRepo;
	private final ProductImageRepository prdImgRepo;
	private final String uploadDir = "C:/coco/uploads/";
	private final IReviewService reviewService;

	/**
	 * API: 관리자 상품 등록
	 */
	@Transactional
	public ProductEntity createProduct(ProductSaveDTO dto, List<MultipartFile> files) throws IOException {

		// 카테고리 조회 및 상품 기본 정보 저장
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
		newProduct.setStatus(dto.getStatus() != null ? dto.getStatus() : "SALE");

		ProductEntity savedProduct = prdRepo.save(newProduct);

		// 옵션 저장
		saveOptions(savedProduct, dto.getOptions());

		// 이미지 저장 로직
		saveImages(savedProduct, files);

		return savedProduct;
	}

	/**
	 * API: 관리자 상품 수정
	 */
	@Transactional
	public ProductEntity updateProduct(Long prdNo, ProductSaveDTO dto, List<MultipartFile> files) throws IOException {
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

		// 옵션 수정 (기존 옵션 삭제 후 재생성)
		updateOptions(product, dto.getOptions());

		// 이미지 추가 저장
		if (files != null && !files.isEmpty()) {
			saveImages(product, files);
		}

		return product;
	}

	/**
	 * API: 관리자 상품 삭제 (논리적 삭제로 변경)
	 */
	public void deleteProduct(Long prdNo) {
		ProductEntity product = prdRepo.findById(prdNo).orElseThrow(() -> new RuntimeException("상품을 찾을 수 없습니다."));

		// 실제로 지우지 않고 상태만 변경
		product.delete();

		// 상태를 '판매중지' 등으로 같이 변경할 수도 있음
		product.setStatus("STOP");
	}
	
	// 리뷰 수 조회
    public int getReviewCount(ProductEntity product) {
        return reviewService.getReviewCount(product);
    }

    // 평균 평점 조회
    public double getAverageRating(ProductEntity product) {
        return reviewService.getAverageRating(product);
    }

	// ================= 내부 헬퍼 메서드 =================

	// 옵션 저장
	private void saveOptions(ProductEntity product, List<ProductSaveDTO.OptionDTO> optionDtos) {
		if (optionDtos == null)
			return;

		for (ProductSaveDTO.OptionDTO optDto : optionDtos) {
			// 정적 생성 메서드 호출
			ProductOptionEntity option = ProductOptionEntity.create(product, optDto.getOptionName(),
					optDto.getOptionValue(), optDto.getAddPrice(), optDto.getStock());
			optionRepo.save(option);
		}
	}

	// 옵션 수정
	private void updateOptions(ProductEntity product, List<ProductSaveDTO.OptionDTO> optionDtos) {
		List<ProductOptionEntity> existingOptions = product.getOptions();
		if (existingOptions != null && !existingOptions.isEmpty()) {
			// ConcurrentModificationException 방지를 위해 리스트 복사본 사용 권장되나,
			// deleteAll은 내부적으로 처리하므로 바로 호출
			optionRepo.deleteAll(existingOptions);
			product.getOptions().clear();
		}

		// 새 옵션 목록 저장
		saveOptions(product, optionDtos);
	}

	// 이미지 저장
	private void saveImages(ProductEntity product, List<MultipartFile> files) throws IOException {
		if (files != null && !files.isEmpty()) {
			// 기존 이미지 개수를 파악하여 순서(sortOrder) 지정 (없으면 1부터)
			int currentMaxOrder = product.getImages() != null ? product.getImages().size() : 0;
			int sortOrder = currentMaxOrder + 1;

			for (MultipartFile file : files) {
				if (file.isEmpty())
					continue;

				String originalFileName = file.getOriginalFilename();
				String uuid = UUID.randomUUID().toString();
				String savedFileName = uuid + "_" + originalFileName;

				File folder = new File(uploadDir);
				if (!folder.exists())
					folder.mkdirs();

				File dest = new File(uploadDir, savedFileName);
				file.transferTo(dest);

				ProductImageEntity newImage = new ProductImageEntity();
				newImage.setProduct(product);

				// ex. /images/uploads/uuid_파일명.jpg
				newImage.setImageUrl("http://localhost:8080/images/uploads/" + savedFileName);

				newImage.setSortOrder(sortOrder++);
				prdImgRepo.save(newImage);
			}
		}
	}

	/**
	 * API: 관리자 대시보드 통계 조회
	 */
	@Transactional(readOnly = true)
	public Map<String, Long> getDashboardStats() {
		Map<String, Long> stats = new HashMap<>();

		// 전체 상품 수
		long totalProducts = prdRepo.count();
		// 판매중 상품 수 (DB값이 "SALE"인 것)
		long inStockProducts = prdRepo.countByStatus("SALE");
		// 품절 상품 수 (DB값이 "SOLD_OUT"인 것)
		long outOfStockProducts = prdRepo.countByStatus("SOLD_OUT");
		// 총 재고 수량 (옵션 테이블의 stock 총합)
		long totalStock = optionRepo.sumTotalStock();

		stats.put("totalProducts", totalProducts);
		stats.put("inStockProducts", inStockProducts);
		stats.put("outOfStockProducts", outOfStockProducts);
		stats.put("totalStock", totalStock);

		return stats;
	}
}