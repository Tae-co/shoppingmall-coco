package com.shoppingmallcoco.project.repository.order;

import com.shoppingmallcoco.project.entity.order.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

}
