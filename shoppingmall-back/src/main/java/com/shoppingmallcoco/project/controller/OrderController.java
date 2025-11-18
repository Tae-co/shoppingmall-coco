package com.shoppingmallcoco.project.controller;

import com.shoppingmallcoco.project.dto.order.OrderRequestDto;
import com.shoppingmallcoco.project.dto.order.OrderResponseDto;
import com.shoppingmallcoco.project.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // "이 클래스는 JSON 데이터를 반환하는 API '컨트롤러'입니다."
@RequiredArgsConstructor // final이 붙은 '서비스'를 주입받기 위한 생성자
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    /**
     * 주문 생성 API
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequestDto requestDto) {


        Long tempMemberId = 1L; // (임시) 회원 ID

        try {

            Long orderId = orderService.createOrder(requestDto, tempMemberId);


            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("주문이 성공적으로 생성되었습니다. 주문 ID: " + orderId);

        } catch (RuntimeException e) {
            // (예외 처리) 재고 부족 등 문제가 생겼을 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage()); // 서비스에서 던진 에러 메시지 반환
        }
    }
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponseDto>> getMyOrderHistory() {


        Long tempMemberId = 1L; // (임시) 테스트용 회원 ID: 1 (홍길동)

        // 서비스 호출
        List<OrderResponseDto> orderHistory = orderService.getOrderHistory(tempMemberId);

        return ResponseEntity.ok(orderHistory);

        }

    /**
     * [추가] 주문 취소 API
     * POST /api/orders/{orderNo}/cancel
     */
    @PostMapping("/{orderNo}/cancel")
    public ResponseEntity<String> cancelOrder(@PathVariable Long orderNo) {

        Long tempMemberId = 1L; // (임시) 로그인한 회원 ID

        try {
            orderService.cancelOrder(orderNo, tempMemberId);
            return ResponseEntity.ok("주문이 성공적으로 취소되었습니다.");

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

}