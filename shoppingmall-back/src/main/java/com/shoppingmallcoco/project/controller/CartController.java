package com.shoppingmallcoco.project.controller;

import com.shoppingmallcoco.project.dto.CartRequestDto;
import com.shoppingmallcoco.project.dto.CartResponseDto;
import com.shoppingmallcoco.project.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/coco/members/cart")
public class CartController {

    private final CartService cartService;

    // 장바구니 추가
    @PostMapping("/cartform")
    public CartResponseDto addCart(@RequestBody CartRequestDto dto) {
        return cartService.addToCart(dto);
    }

    // 장바구니 조회
    @GetMapping("/items/{memNo}")
    public List<CartResponseDto> getCartItems(@PathVariable Long memNo) {
        return cartService.getCartItems(memNo);
    }

    // 수량 변경
    @PatchMapping("/items/{cartNo}/{qty}")
    public CartResponseDto updateQty(@PathVariable Long cartNo, @PathVariable Integer qty) {
        return cartService.updateCartQty(cartNo, qty);
    }

    // 항목 삭제
    @DeleteMapping("/items/{cartNo}")
    public void deleteItem(@PathVariable Long cartNo) {
        cartService.deleteCart(cartNo);
    }

    // 장바구니 전체 비우기
    @DeleteMapping("/items/clear/{memNo}")
    public void clearCart(@PathVariable Long memNo) {
        cartService.clearCart(memNo);
    }
}
