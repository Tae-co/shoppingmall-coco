package com.shoppingmallcoco.project.controller;

import com.shoppingmallcoco.project.dto.order.OrderRequestDto;
import com.shoppingmallcoco.project.service.order.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // "이 클래스는 JSON 데이터를 반환하는 API '컨트롤러'입니다."
@RequiredArgsConstructor // final이 붙은 '서비스'를 주입받기 위한 생성자
@RequestMapping("/api/orders") // "이 컨트롤러는 /api/orders 주소로 오는 요청을 담당합니다."
public class OrderController {

    private final OrderService orderService; // '서비스'를 주입받음

    /**
     * 주문 생성 API
     * POST /api/orders
     */
    @PostMapping
    public ResponseEntity<String> createOrder(@RequestBody OrderRequestDto requestDto) {

        // (참고) 실제로는 Spring Security에서 로그인한 회원 정보를 가져와야 함
        Integer tempMemberId = 1; // (임시) 회원 ID

        try {
            // '서비스'에게 DTO와 회원 ID를 넘겨 '주문 생성' 로직을 실행시킴
            Integer orderId = orderService.createOrder(requestDto, tempMemberId);

            // 성공 시, 생성된 주문 ID와 함께 201 (Created) 상태 반환
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("주문이 성공적으로 생성되었습니다. 주문 ID: " + orderId);

        } catch (RuntimeException e) {
            // (예외 처리) 재고 부족 등 문제가 생겼을 경우
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage()); // 서비스에서 던진 에러 메시지 반환
        }
    }

    // (참고) 나중에 '주문 내역 조회 API' (GET) 등을 여기에 추가하게 됩니다.
    // @GetMapping("/my-history")
    // public ResponseEntity<?> getMyOrderHistory(...) { ... }

}