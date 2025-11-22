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

    private Long orderNo;
    private LocalDate orderDate;
    private Long totalPrice;
    private String status;

    private String recipientName;
    private String recipientPhone;
    private String orderZipcode;
    private String orderAddress1;
    private String orderAddress2;
    private String deliveryMessage;

    private Long pointsUsed;

    private List<OrderItemResponseDto> orderItems = new ArrayList<>();

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

        this.orderItems = order.getOrderItems().stream()
                .map(OrderItemResponseDto::new)
                .collect(Collectors.toList());
    }

    @Getter
    @Setter
    @NoArgsConstructor
    public static class OrderItemResponseDto {
        private Long prdNo;
        private Long optionNo;
        private Long orderQty;
        private Long orderPrice;

        public OrderItemResponseDto(OrderItem orderItem) {

            this.prdNo = orderItem.getProduct().getPrdNo();
            this.optionNo = orderItem.getProductOption().getOptionNo();

            this.orderQty = orderItem.getOrderQty();
            this.orderPrice = orderItem.getOrderPrice();
        }
    }
}