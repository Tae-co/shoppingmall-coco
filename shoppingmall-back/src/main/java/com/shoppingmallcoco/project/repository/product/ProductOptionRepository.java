package com.shoppingmallcoco.project.repository.product;

import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

// 옵션 엔티티를 관리하는 레포지토리입니다.
public interface ProductOptionRepository extends JpaRepository<ProductOptionEntity, Long> {
    // 기본 JpaRepository 메서드(findById 등)를 사용합니다.
}