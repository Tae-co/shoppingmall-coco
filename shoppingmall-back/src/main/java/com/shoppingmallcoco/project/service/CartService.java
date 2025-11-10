package com.shoppingmallcoco.project.service;

import com.shoppingmallcoco.project.dto.CartRequestDto;
import com.shoppingmallcoco.project.dto.CartResponseDto;
import com.shoppingmallcoco.project.entity.Cart;
import com.shoppingmallcoco.project.entity.Member;
import com.shoppingmallcoco.project.entity.ProductOption;
import com.shoppingmallcoco.project.repository.CartRepository;
import com.shoppingmallcoco.project.repository.MemberRepository;
import com.shoppingmallcoco.project.repository.ProductOptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final MemberRepository memberRepository;
    private final ProductOptionRepository productOptionRepository;

    //장바구니 추가
    @Transactional
    public CartResponseDto addToCart(CartRequestDto dto) {
        Member member = memberRepository.findById(dto.getMemNo())
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다. memNo=" + dto.getMemNo()));

        ProductOption option = productOptionRepository.findById(dto.getOptionNo())
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션이 존재하지 않습니다. optionNo=" + dto.getOptionNo()));

        // Optional → Cart 처리 수정
        Cart existing = cartRepository.findByMember_MemNoAndProductOption_OptionNo(dto.getMemNo(), dto.getOptionNo())
                .orElse(null);

        if (existing != null) {
            existing.addQuantity(dto.getCartQty());
            return CartResponseDto.fromEntity(cartRepository.save(existing));
        }

        // Cart.create() → 직접 빌더 사용
        Cart cart = Cart.builder()
                .member(member)
                .productOption(option)
                .cartQty(dto.getCartQty())
                .build();

        return CartResponseDto.fromEntity(cartRepository.save(cart));
    }

    //장바구니 목록 조회
    public List<CartResponseDto> getCartItems(Long memNo) {
        return cartRepository.findByMember_MemNo(memNo).stream()
                .map(CartResponseDto::fromEntity)
                .collect(Collectors.toList());
    }

    // 수량 변경
    @Transactional
    public CartResponseDto updateCartQty(Long cartNo, Integer qty) {
        Cart cart = cartRepository.findById(cartNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 cartNo가 없습니다."));
        cart.updateQuantity(qty);
        return CartResponseDto.fromEntity(cartRepository.save(cart));
    }

    //장바구니 삭제
    @Transactional
    public void deleteCart(Long cartNo) {
        cartRepository.deleteById(cartNo);
    }
}
