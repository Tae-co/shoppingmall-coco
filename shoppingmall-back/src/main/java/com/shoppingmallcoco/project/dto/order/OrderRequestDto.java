package com.shoppingmallcoco.project.dto.order;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderRequestDto {

    // --- 1. 주문 상품 목록 ---
    private List<OrderItemDto> orderItems;

    // --- 2. 배송지 정보 ---
    private String recipientName;
    private String recipientPhone;
    private String postcode;
    private String address;
    private String addressDetail;
    private String deliveryMessage;

    // --- 3. 결제 정보 ---
    private Integer pointsUsed;






    @Getter
    @Setter
    @NoArgsConstructor
    public static class OrderItemDto {
        private Integer prdNo; // 상품 번호
        private Integer orderQty; // 주문 수량
    }
}