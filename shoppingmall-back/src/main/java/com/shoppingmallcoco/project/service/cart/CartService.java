package com.shoppingmallcoco.project.service.cart;

import com.shoppingmallcoco.project.dto.cart.CartRequestDto;
import com.shoppingmallcoco.project.dto.cart.CartResponseDto;
import com.shoppingmallcoco.project.entity.cart.CartEntity;
import com.shoppingmallcoco.project.entity.Member;
import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
import com.shoppingmallcoco.project.repository.cart.CartRepository;
import com.shoppingmallcoco.project.repository.MemberRepository;
import com.shoppingmallcoco.project.repository.product.ProductOptionRepository;
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

    private ProductOptionEntity getProductOption(Long optionNo) {
        return productOptionRepository.findById(optionNo)
                .orElseThrow(() -> new IllegalArgumentException("상품 옵션이 존재하지 않습니다. optionNo=" + optionNo));
    }

    // 장바구니 추가
    @Transactional
    public CartResponseDto addToCart(CartRequestDto dto) {
        Member member = getMember(dto.getMemNo());
        ProductOptionEntity option = getProductOption(dto.getOptionNo());

        CartEntity existing = cartRepository
                .findByMember_MemNoAndProductOption_OptionNo(dto.getMemNo(), dto.getOptionNo())
                .orElse(null);

        if (existing != null) {
            existing.addQuantity(dto.getCartQty());
            return CartResponseDto.fromEntity(cartRepository.save(existing));
        }

        CartEntity cart = CartEntity.create(member, option, dto.getCartQty());
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
        CartEntity cart = cartRepository.findById(cartNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 cartNo가 없습니다."));
        cart.updateQuantity(qty);
        return CartResponseDto.fromEntity(cartRepository.save(cart));
    }

    // 장바구니 삭제
    @Transactional
    public void deleteCart(Long cartNo) {
        cartRepository.deleteByCartNo(cartNo);
    }
    // 장바구니 전체 비우기
    @Transactional
    public void clearCart(Long memNo) {
        cartRepository.deleteAllByMember_MemNo(memNo);
    }
}
