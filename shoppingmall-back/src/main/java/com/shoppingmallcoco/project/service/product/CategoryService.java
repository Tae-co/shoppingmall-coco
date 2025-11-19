package com.shoppingmallcoco.project.service.product;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.shoppingmallcoco.project.entity.product.CategoryEntity;
import com.shoppingmallcoco.project.repository.product.CategoryRepository;


@Service
public class CategoryService {
	
	@Autowired
	private CategoryRepository catRepo;
	
	// 카테고리 생성
    @Transactional
    public CategoryEntity createCategory(String categoryName, Long parentCategoryNo) {
        CategoryEntity category = new CategoryEntity();
        category.setCategoryName(categoryName);
        
        if (parentCategoryNo != null) {
            CategoryEntity parent = catRepo.findById(parentCategoryNo)
                    .orElseThrow(() -> new RuntimeException("부모 카테고리를 찾을 수 없습니다."));
            category.setParentCategory(parent);
        }
        
        return catRepo.save(category);
    }
	
	// 카테고리 수정
	@Transactional
	public CategoryEntity updateCategory(Long categoryNo, String categoryName, Long parentCategoryNo) {
	    CategoryEntity category = catRepo.findById(categoryNo)
	            .orElseThrow(() -> new RuntimeException("카테고리를 찾을 수 없습니다."));

	    // 이름 수정
	    category.setCategoryName(categoryName);

	    // 부모 카테고리 수정
	    if (parentCategoryNo == null) {
	        category.setParentCategory(null); 
	    } else {
	        if(categoryNo.equals(parentCategoryNo)) {
	             throw new RuntimeException("자기 자신을 상위 카테고리로 설정할 수 없습니다.");
	        }
	        
	        CategoryEntity parent = catRepo.findById(parentCategoryNo)
	                .orElseThrow(() -> new RuntimeException("부모 카테고리가 존재하지 않습니다."));
	        category.setParentCategory(parent);
	    }

	    return catRepo.save(category);
	}
	
	// 카테고리 삭제
	@Transactional
	public void deleteCategory(Long categoryNo) {
		catRepo.deleteById(categoryNo);
	}

}
