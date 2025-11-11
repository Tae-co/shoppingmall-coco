package com.shoppingmallcoco.project.repository;

import com.shoppingmallcoco.project.entity.order.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer>{
}
