package com.shoppingmallcoco.project.repository.product;

import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductOptionRepository extends JpaRepository<ProductOptionEntity, Long> {
}
