package com.shoppingmallcoco.project.dto.order;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class OrderRequestDto {

    private List<OrderItemDto> orderItems;

    // 배송지 정보
    private String recipientName;
    private String recipientPhone;
    private String orderZipcode; // (ERD에 맞춘 이름)
    private String orderAddress1; // (ERD에 맞춘 이름)
    private String orderAddress2; // (ERD에 맞춘 이름)
    private String deliveryMessage;

    // 결제 정보
    private Integer pointsUsed;


    /**
     * 개별 상품 DTO (Inner Class)
     */
    @Getter
    @Setter
    @NoArgsConstructor
    public static class OrderItemDto {
        private Integer prdNo;
        private Integer orderQty;
        private Integer optionNo;
    }
}