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

    // 공통 조회 메서드 (중복 제거)
    private Member getMember(Long memNo) {
        return memberRepository.findById(memNo)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않습니다. memNo=" + memNo));
    }

    private ProductOption getProductOption(Long optionNo) {
        return productOptionRepository.findById(optionNo)
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션이 존재하지 않습니다. optionNo=" + optionNo));
    }

    // 장바구니 추가
    @Transactional
    public CartResponseDto addToCart(CartRequestDto dto) {
        Member member = getMember(dto.getMemNo());
        ProductOption option = getProductOption(dto.getOptionNo());

        Cart existing = cartRepository
                .findByMember_MemNoAndProductOption_OptionNo(dto.getMemNo(), dto.getOptionNo())
                .orElse(null);

        if (existing != null) {
            existing.addQuantity(dto.getCartQty());
            return CartResponseDto.fromEntity(cartRepository.save(existing));
        }

        Cart cart = Cart.create(member, option, dto.getCartQty());
        return CartResponseDto.fromEntity(cartRepository.save(cart));
    }

    // 장바구니 목록 조회
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

    // 장바구니 삭제
    @Transactional
    public void deleteCart(Long cartNo) {
        cartRepository.deleteById(cartNo);
    }
    // 장바구니 전체 비우기
    @Transactional
    public void clearCart(Long memNo) {
        List<Cart> carts = cartRepository.findByMember_MemNo(memNo);
        if (carts.isEmpty()) {
            throw new IllegalArgumentException("비울 장바구니가 없습니다. memNo=" + memNo);
        }
        cartRepository.deleteAllByMember_MemNo(memNo);
    }
}
