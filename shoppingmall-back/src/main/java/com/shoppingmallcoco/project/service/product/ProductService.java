package com.shoppingmallcoco.project.service.product;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.criteria.Predicate;

import com.shoppingmallcoco.project.entity.product.ProductEntity;
import com.shoppingmallcoco.project.repository.product.ProductRepository;
import com.shoppingmallcoco.project.service.IReviewService;

@Service
public class ProductService {
	
	@Autowired
    private ProductRepository prdRepo;
	
	@Autowired
	private IReviewService reviewService;
	
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
	
	public Page<ProductEntity> getProductList(String q, List<String> skinType, List<String> skinConcern, List<String> personalColor, String sort, int page, int size) {
	
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
	
}
