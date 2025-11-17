package com.shoppingmallcoco.project.service.order;

import com.shoppingmallcoco.project.dto.order.OrderRequestDto;
import com.shoppingmallcoco.project.entity.order.Order;
import com.shoppingmallcoco.project.entity.order.OrderItem;
import com.shoppingmallcoco.project.repository.OrderRepository;
// (참고) 나중에 상품 재고, 가격 확인을 위해 ProductRepository 등이 필요합니다.
// import com.shoppingmallcoco.project.repository.product.ProductRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    // private final ProductRepository productRepository; // (나중에 주석 해제)

    /**
     * 주문 생성 (핵심 로직)
     * @param requestDto (주문 요청 상자)
     * @param memNo (주문한 회원 번호)
     * @return 생성된 주문의 ID (orderNo)
     */
    @Transactional
    public Integer createOrder(OrderRequestDto requestDto, Integer memNo) {

        // --- 1. 주문 상품(OrderItem) 엔티티 목록 생성 ---
        List<OrderItem> orderItems = new ArrayList<>();

        int totalOrderPrice = 0; // (임시) 총 주문 금액
        for (OrderRequestDto.OrderItemDto itemDto : requestDto.getOrderItems()) {

            // (임시 가격 로직)
            int tempProductPrice = 5000;

            OrderItem orderItem = new OrderItem();
            orderItem.setPrdNo(itemDto.getPrdNo());
            orderItem.setOrderQty(itemDto.getOrderQty());
            orderItem.setOptionNo(itemDto.getOptionNo());
            orderItem.setOrderPrice(tempProductPrice);

            orderItems.add(orderItem);
            totalOrderPrice += (tempProductPrice * itemDto.getOrderQty());
        }

        // --- 2. 주문(Order) 엔티티 생성 및 데이터 매핑 ---
        Order order = new Order();
        order.setMemNo(memNo);
        order.setOrderDate(LocalDate.now());
        order.setStatus("PENDING");
        order.setTotalPrice(totalOrderPrice); // (임시) 총 금액

        // (프론트 검토 완료된) 배송지 및 기타 정보 매핑
        order.setRecipientName(requestDto.getRecipientName());
        order.setRecipientPhone(requestDto.getRecipientPhone());
        order.setOrderZipcode(requestDto.getOrderZipcode());
        order.setOrderAddress1(requestDto.getOrderAddress1());
        order.setOrderAddress2(requestDto.getOrderAddress2());
        order.setDeliveryMessage(requestDto.getDeliveryMessage());
        order.setPointsUsed(requestDto.getPointsUsed());

        // --- 3. 관계 설정 (Order가 OrderItem을 관리) ---
        for (OrderItem orderItem : orderItems) {
            order.getOrderItems().add(orderItem);
            orderItem.setOrder(order);
        }

        // --- 4. 주문 저장 ---
        Order savedOrder = orderRepository.save(order);

        return savedOrder.getOrderNo();
    }
}