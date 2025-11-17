package com.shoppingmallcoco.project.dto.order;

import com.shoppingmallcoco.project.entity.order.Order;
import com.shoppingmallcoco.project.entity.order.OrderItem;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
@NoArgsConstructor
public class OrderResponseDto {

    // 1. 주문 기본 정보
    private Long orderNo;
    private LocalDate orderDate;
    private Long totalPrice;
    private String status;

    // 2. 배송지 정보
    private String recipientName;
    private String recipientPhone;
    private String orderZipcode;
    private String orderAddress1;
    private String orderAddress2;
    private String deliveryMessage;

    // 3. 결제 정보
    private Long pointsUsed;

    // 4. 주문 상품 목록 (아래 내부 클래스 DTO 리스트)
    private List<OrderItemResponseDto> orderItems = new ArrayList<>();

    // [생성자] 엔티티(Order)를 받아서 DTO로 변환하는 역할
    public OrderResponseDto(Order order) {
        this.orderNo = order.getOrderNo();
        this.orderDate = order.getOrderDate();
        this.totalPrice = order.getTotalPrice();
        this.status = order.getStatus();
        this.recipientName = order.getRecipientName();
        this.recipientPhone = order.getRecipientPhone();
        this.orderZipcode = order.getOrderZipcode();
        this.orderAddress1 = order.getOrderAddress1();
        this.orderAddress2 = order.getOrderAddress2();
        this.deliveryMessage = order.getDeliveryMessage();
        this.pointsUsed = order.getPointsUsed();

        // 주문 상품 리스트(Entity List)를 DTO 리스트로 변환
        this.orderItems = order.getOrderItems().stream()
                .map(OrderItemResponseDto::new)
                .collect(Collectors.toList());
    }

    // [내부 클래스] 주문 상품 정보 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    public static class OrderItemResponseDto {
        private Long prdNo;
        private Long optionNo;
        private Long orderQty;
        private Long orderPrice;



        public OrderItemResponseDto(OrderItem orderItem) {
            this.prdNo = orderItem.getPrdNo();
            this.optionNo = orderItem.getOptionNo();
            this.orderQty = orderItem.getOrderQty();
            this.orderPrice = orderItem.getOrderPrice();
        }
    }
}