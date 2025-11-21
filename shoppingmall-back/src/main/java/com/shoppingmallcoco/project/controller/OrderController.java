package com.shoppingmallcoco.project.controller;

import com.shoppingmallcoco.project.dto.order.OrderRequestDto;
import com.shoppingmallcoco.project.dto.order.OrderResponseDto;
import com.shoppingmallcoco.project.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    /**
     * 주문 생성 API
     */
    @PostMapping
    public ResponseEntity<String> createOrder(
            @RequestBody OrderRequestDto requestDto,
            @AuthenticationPrincipal String memId
    ) {
        try {

            Long orderNo = orderService.createOrder(requestDto, memId);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("주문이 성공적으로 생성되었습니다. 주문번호: " + orderNo);

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    /**
     * 주문 내역 조회 API
     */
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponseDto>> getMyOrderHistory(
            @AuthenticationPrincipal String memId
    ) {
        List<OrderResponseDto> orderHistory = orderService.getOrderHistory(memId);
        return ResponseEntity.ok(orderHistory);
    }

    /**
     * 주문 취소 API
     */
    @PostMapping("/{orderNo}/cancel")
    public ResponseEntity<String> cancelOrder(
            @PathVariable Long orderNo,
            @AuthenticationPrincipal String memId
    ) {
        try {
            orderService.cancelOrder(orderNo, memId);
            return ResponseEntity.ok("주문이 성공적으로 취소되었습니다.");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}