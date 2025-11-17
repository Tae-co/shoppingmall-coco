package com.shoppingmallcoco.project.service.order;

import com.shoppingmallcoco.project.dto.order.OrderRequestDto;
import com.shoppingmallcoco.project.dto.order.OrderResponseDto;
import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.order.Order;
import com.shoppingmallcoco.project.entity.order.OrderItem;
import com.shoppingmallcoco.project.repository.OrderRepository;
import com.shoppingmallcoco.project.repository.auth.MemberRepository; // 경로 확인

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private final OrderRepository orderRepository;
    private final MemberRepository memberRepository;

    /**
     * 주문 생성
     */
    @Transactional
    public Long createOrder(OrderRequestDto requestDto, Long memNo) {

        // 1. 회원 조회
        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다. ID: " + memNo));

        // 2. 상품 목록 생성 (임시 가격)
        List<OrderItem> orderItems = new ArrayList<>();
        long totalOrderPrice = 0;

        for (OrderRequestDto.OrderItemDto itemDto : requestDto.getOrderItems()) {
            long tempProductPrice = 5000L;

            OrderItem orderItem = new OrderItem();
            orderItem.setPrdNo(itemDto.getPrdNo());
            orderItem.setOrderQty(itemDto.getOrderQty());
            orderItem.setOptionNo(itemDto.getOptionNo());
            orderItem.setOrderPrice(tempProductPrice);

            orderItems.add(orderItem);
            totalOrderPrice += (tempProductPrice * itemDto.getOrderQty());
        }

        // 3. 포인트 차감
        long pointsToUse = requestDto.getPointsUsed();
        if (pointsToUse > 0) {
            // Member에 추가한 메서드 사용
            member.usePoints(pointsToUse);
        }

        // 4. 주문 생성
        Order order = new Order();
        order.setMember(member); // 객체 연결
        order.setOrderDate(LocalDate.now());
        order.setStatus("PENDING");
        order.setTotalPrice(totalOrderPrice);

        order.setRecipientName(requestDto.getRecipientName());
        order.setRecipientPhone(requestDto.getRecipientPhone());
        order.setOrderZipcode(requestDto.getOrderZipcode());
        order.setOrderAddress1(requestDto.getOrderAddress1());
        order.setOrderAddress2(requestDto.getOrderAddress2());
        order.setDeliveryMessage(requestDto.getDeliveryMessage());
        order.setPointsUsed(pointsToUse);

        // 5. 관계 설정
        for (OrderItem orderItem : orderItems) {
            order.addOrderItem(orderItem);
        }

        // 6. 저장
        Order savedOrder = orderRepository.save(order);
        return savedOrder.getOrderNo();
    }

    /**
     * 주문 조회
     */
    public List<OrderResponseDto> getOrderHistory(Long memNo) {
        List<Order> orders = orderRepository.findAllByMemberMemNoOrderByOrderNoDesc(memNo);
        return orders.stream()
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * 주문 취소
     */
    @Transactional
    public void cancelOrder(Long orderNo, Long memNo) {
        Order order = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("해당 주문을 찾을 수 없습니다. ID: " + orderNo));

        if (!order.getMember().getMemNo().equals(memNo)) {
            throw new RuntimeException("권한 없음");
        }

        if ("SHIPPED".equals(order.getStatus())) {
            throw new RuntimeException("취소 불가");
        }

        // 포인트 환불
        if (order.getPointsUsed() != null && order.getPointsUsed() > 0) {
            Member member = order.getMember();
            // Member 엔티티에 @Setter가 있어야 이 코드가 동작합니다!
            member.setPoint(member.getPoint() + order.getPointsUsed());
        }

        order.setStatus("CANCELLED");
    }
}