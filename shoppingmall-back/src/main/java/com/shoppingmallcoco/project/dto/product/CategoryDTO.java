package com.shoppingmallcoco.project.dto.product;

import com.shoppingmallcoco.project.entity.product.CategoryEntity;
import lombok.Data;

@Data
public class CategoryDTO {
    private Long categoryNo;
    private String categoryName;
    private Long parentCategoryNo;

    public CategoryDTO(CategoryEntity entity) {
        this.categoryNo = entity.getCategoryNo();
        this.categoryName = entity.getCategoryName();
        if (entity.getParentCategory() != null) {
            this.parentCategoryNo = entity.getParentCategory().getCategoryNo();
        }
    }
}