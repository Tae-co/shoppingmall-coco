package com.shoppingmallcoco.project.service.mypage;

import com.shoppingmallcoco.project.dto.mypage.MyPageResponseDto;
import com.shoppingmallcoco.project.dto.mypage.RecentOrderDto;
import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.order.Order;
import com.shoppingmallcoco.project.entity.order.OrderItem;
import com.shoppingmallcoco.project.entity.product.ProductImageEntity;
import com.shoppingmallcoco.project.repository.auth.MemberRepository;
import com.shoppingmallcoco.project.repository.order.OrderRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final MemberRepository memberRepository;
    private final OrderRepository orderRepository;

    // ✔ 로그인한 사용자 기반 마이페이지 조회
    public MyPageResponseDto getMyPage() {

        // 1) JWT → 로그인한 memId 가져오기
        String loginId = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        // 2) memId → Member 조회
        Member member = memberRepository.findByMemId(loginId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다."));

        Long memNo = member.getMemNo();

        // 3) 팀원이 만든 Repository 메서드 그대로 사용 (최근 주문 전체)
        List<Order> allOrders =
                orderRepository.findAllByMemberMemNoOrderByOrderNoDesc(memNo);

        // 4) 최근 3개만 가져오기
        List<Order> recentOrders =
                allOrders.size() > 3 ? allOrders.subList(0, 3) : allOrders;

        // 5) DTO 변환
        List<RecentOrderDto> recentOrderDtos = recentOrders.stream()
                .map(this::mapToRecentOrderDto)
                .collect(Collectors.toList());

        // 6) 최종 응답
        return MyPageResponseDto.builder()
                .nickname(member.getMemNickname())
                .point(member.getPoint())
                .recentOrders(recentOrderDtos)
                .build();
    }

    // ✔ 주문 1개 → RecentOrderDto 변환
    private RecentOrderDto mapToRecentOrderDto(Order order) {

        List<OrderItem> items = order.getOrderItems();

        // 주문 아이템이 없을 경우
        if (items == null || items.isEmpty()) {
            return RecentOrderDto.builder()
                    .orderNo(order.getOrderNo())
                    .orderId(String.format("ORD-%03d", order.getOrderNo()))
                    .orderDate(order.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                    .totalPrice(order.getTotalPrice())
                    .status(order.getStatus())
                    .mainProductName("상품 정보가 없습니다.")
                    .mainOptionName("")
                    .thumbnailImage(null)
                    .extraItemCount(0)
                    .build();
        }

        // 첫 번째 상품 = 대표 상품
        OrderItem mainItem = items.get(0);

        String mainProductName = mainItem.getProduct().getPrdName();
        String mainOptionName = mainItem.getProductOption().getOptionValue();

        // 상품 이미지 리스트 가져오기
        List<ProductImageEntity> images = mainItem.getProduct().getImages();

        // 썸네일 이미지 선택 (sortOrder = 1 → 없다면 첫 번째 이미지)
        String thumbnail = (images != null && !images.isEmpty())
                ? images.stream()
                .filter(img -> img.getSortOrder() == 1)
                .map(ProductImageEntity::getImageUrl)
                .findFirst()
                .orElse(images.get(0).getImageUrl())
                : null;

        return RecentOrderDto.builder()
                .orderNo(order.getOrderNo())
                .orderId(String.format("ORD-%03d", order.getOrderNo()))
                .orderDate(order.getOrderDate().format(DateTimeFormatter.ofPattern("yyyy.MM.dd")))
                .totalPrice(order.getTotalPrice())
                .status(order.getStatus())
                .mainProductName(mainProductName)
                .mainOptionName(mainOptionName)
                .thumbnailImage(thumbnail)
                .extraItemCount(items.size() - 1)
                .build();
    }
}
