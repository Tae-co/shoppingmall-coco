package com.shoppingmallcoco.project.service.order;

import com.shoppingmallcoco.project.dto.order.OrderRequestDto;
import com.shoppingmallcoco.project.dto.order.OrderResponseDto;
import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.order.Order;
import com.shoppingmallcoco.project.entity.order.OrderItem;
import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
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

    private static final long SHIPPING_FEE = 3000L;
    private static final long FREE_SHIPPING_THRESHOLD = 30000L;

    /**
     * 주문 생성 (보안 적용: memId 사용)
     */
    @Transactional
    //  Long memNo -> String memId (컨트롤러가 아이디를 줍니다)
    public Long createOrder(OrderRequestDto requestDto, String memId) {

        //  findById -> findByMemId (아이디로 진짜 회원 찾기)
        Member member = memberRepository.findByMemId(memId)
                .orElseThrow(() -> new RuntimeException("회원 정보를 찾을 수 없습니다. ID: " + memId));


        List<OrderItem> orderItems = new ArrayList<>();
        long totalOrderPrice = 0;

        for (OrderRequestDto.OrderItemDto itemDto : requestDto.getOrderItems()) {
            Long optionNo = itemDto.getOptionNo();
            ProductOptionEntity option = productOptionRepository.findById(optionNo)
                    .orElseThrow(() -> new RuntimeException("상품 옵션을 찾을 수 없습니다."));

            option.removeStock(itemDto.getOrderQty().intValue());

            long realPrice = option.getProduct().getPrdPrice() + option.getAddPrice();

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(option.getProduct());
            orderItem.setProductOption(option);
            orderItem.setOrderQty(itemDto.getOrderQty());
            orderItem.setOrderPrice(realPrice);

            orderItems.add(orderItem);
            totalOrderPrice += (realPrice * itemDto.getOrderQty());
        }

        long shippingFee = (totalOrderPrice >= FREE_SHIPPING_THRESHOLD) ? 0 : SHIPPING_FEE;

        // 포인트 로직
        long pointsToUse = requestDto.getPointsUsed();
        if (pointsToUse > 0) {
            if (member.getPoint() < pointsToUse) throw new RuntimeException("포인트 부족");
            if (pointsToUse > (totalOrderPrice + shippingFee)) throw new RuntimeException("결제 금액 초과 사용 불가");
            member.usePoints(pointsToUse);
        }

        long finalTotalPrice = totalOrderPrice + shippingFee - pointsToUse;

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

        for (OrderItem orderItem : orderItems) {
            order.addOrderItem(orderItem);
        }

        return orderRepository.save(order).getOrderNo();
    }

    /**
     * 주문 내역 조회
     */

    public List<OrderResponseDto> getOrderHistory(String memId) {
        // 1. 아이디로 회원을 먼저 찾습니다.
        Member member = memberRepository.findByMemId(memId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        // 2. 찾은 회원의 번호(memNo)로 주문 내역을 조회합니다.
        List<Order> orders = orderRepository.findAllByMemberMemNoOrderByOrderNoDesc(member.getMemNo());

        return orders.stream()
                .map(OrderResponseDto::new)
                .collect(Collectors.toList());
    }

    /**
     * 주문 취소
     */
    @Transactional

    public void cancelOrder(Long orderNo, String memId) {
        Order order = orderRepository.findById(orderNo)
                .orElseThrow(() -> new RuntimeException("주문 없음"));

        //  권한 확인 (문자열 아이디 비교)
        if (!order.getMember().getMemId().equals(memId)) {
            throw new RuntimeException("권한 없음: 본인의 주문만 취소할 수 있습니다.");
        }

        if ("SHIPPED".equals(order.getStatus())) throw new RuntimeException("취소 불가");

        for (OrderItem item : order.getOrderItems()) {
            item.getProductOption().addStock(item.getOrderQty().intValue());
        }

        if (order.getPointsUsed() != null && order.getPointsUsed() > 0) {
            order.getMember().returnPoints(order.getPointsUsed());
        }

        order.setStatus("CANCELLED");
    }
}