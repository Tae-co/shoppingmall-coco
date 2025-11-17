package com.shoppingmallcoco.project.repository;

import com.shoppingmallcoco.project.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
