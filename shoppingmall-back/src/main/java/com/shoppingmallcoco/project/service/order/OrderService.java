package com.shoppingmallcoco.project.service.order;

import com.shoppingmallcoco.project.dto.order.OrderRequestDto;
import com.shoppingmallcoco.project.dto.order.OrderResponseDto;
import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.order.Order;
import com.shoppingmallcoco.project.entity.order.OrderItem;
import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
// [수정] repository.order 패키지로 import 경로 수정
import com.shoppingmallcoco.project.repository.order.OrderRepository;
import com.shoppingmallcoco.project.repository.auth.MemberRepository;
import com.shoppingmallcoco.project.repository.product.ProductOptionRepository;

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
    private final ProductOptionRepository productOptionRepository;

    // 배송비 정책
    private static final long SHIPPING_FEE = 3000L;
    private static final long FREE_SHIPPING_THRESHOLD = 30000L;

    /**
     * 주문 생성
     */
    @Transactional
    public Long createOrder(OrderRequestDto requestDto, Long memNo) {

        // 1. 회원 조회
        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다."));

        // 2. 상품 조회 및 재고 차감
        List<OrderItem> orderItems = new ArrayList<>();
        long totalOrderPrice = 0;

        for (OrderRequestDto.OrderItemDto itemDto : requestDto.getOrderItems()) {

            // [수정] Long.valueOf 불필요 (이미 Long이면 제거)
            Long optionNo = itemDto.getOptionNo();
            ProductOptionEntity option = productOptionRepository.findById(optionNo)
                    .orElseThrow(() -> new RuntimeException("상품 옵션을 찾을 수 없습니다. ID: " + optionNo));

            // [수정] 재고 차감 (Long -> int 변환)
            // itemDto.getOrderQty()가 Long이므로 intValue()로 변환하여 전달
            option.removeStock(itemDto.getOrderQty().intValue());

            long realPrice = option.getProduct().getPrdPrice() + option.getAddPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(option.getProduct());
            orderItem.setProductOption(option);
            // [수정] 불필요한 박싱 제거
            orderItem.setOrderQty(itemDto.getOrderQty());
            orderItem.setOrderPrice(realPrice);

            orderItems.add(orderItem);
            totalOrderPrice += (long) realPrice * itemDto.getOrderQty();
        }

        // 3. 배송비 계산
        long shippingFee = (totalOrderPrice >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_FEE;

        // 4. 포인트 차감
        long pointsToUse = requestDto.getPointsUsed();
        if (pointsToUse > 0) {
            if (member.getPoint() < pointsToUse) {
                throw new RuntimeException("보유 포인트가 부족합니다.");
            }
            if (pointsToUse > (totalOrderPrice + shippingFee)) {
                throw new RuntimeException("결제 금액보다 많은 포인트를 사용할 수 없습니다.");
            }
            // [수정] (int) 형변환 제거 (Member.usePoints가 Long을 받음)
            member.usePoints(pointsToUse);
        }

        long finalTotalPrice = totalOrderPrice + shippingFee - pointsToUse;

        // 5. 주문 생성
        Order order = new Order();
        order.setMember(member);
        order.setOrderDate(LocalDate.now());
        order.setStatus("PENDING");
        order.setTotalPrice(finalTotalPrice);

        order.setRecipientName(requestDto.getRecipientName());
        order.setRecipientPhone(requestDto.getRecipientPhone());
        order.setOrderZipcode(requestDto.getOrderZipcode());
        order.setOrderAddress1(requestDto.getOrderAddress1());
        order.setOrderAddress2(requestDto.getOrderAddress2());
        order.setDeliveryMessage(requestDto.getDeliveryMessage());
        order.setPointsUsed(pointsToUse);

        // 6. 관계 설정
        for (OrderItem orderItem : orderItems) {
            order.addOrderItem(orderItem);
        }

        // 7. 저장
        Order savedOrder = orderRepository.save(order);
        return savedOrder.getOrderNo();
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDto> getOrderHistory(Long memNo) {
        List<Order> orders = orderRepository.findAllByMemberMemNoOrderByOrderNoDesc(memNo);
        return orders.stream()
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void cancelOrder(Long orderNo, Long memNo) {
        Order order = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문 없음"));

        if (!order.getMember().getMemNo().equals(memNo)) {
            throw new RuntimeException("권한 없음");
        }
        if ("SHIPPED".equals(order.getStatus())) {
            throw new RuntimeException("취소 불가");
        }

        // [추가] 재고 복구
        for (OrderItem item : order.getOrderItems()) {
            // Long -> int 변환
            item.getProductOption().addStock(item.getOrderQty().intValue());
        }

        // [수정] 포인트 환불 (Long 그대로 전달)
        if (order.getPointsUsed() != null && order.getPointsUsed() > 0) {
            order.getMember().returnPoints(order.getPointsUsed());
        }

        order.setStatus("CANCELLED");
    }
}