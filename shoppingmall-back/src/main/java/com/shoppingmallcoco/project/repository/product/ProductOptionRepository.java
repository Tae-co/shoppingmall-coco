package com.shoppingmallcoco.project.repository.product;

import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductOptionRepository extends JpaRepository<ProductOptionEntity, Long> {
    
}
