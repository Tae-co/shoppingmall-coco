package com.shoppingmallcoco.project.dto;

import com.shoppingmallcoco.project.entity.Cart;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class CartResponseDto {

    private Long cartNo;
    private Long memNo;
    private Long optionNo;
    private Integer cartQty;

    // 조회용 상품 정보 (옵션/상품 조인 시만 사용)
    private String productName;
    private Integer productPrice;
    private String productImage;

    public static CartResponseDto fromEntity(Cart cart) {
        var option = cart.getProductOption();
        var product = option.getProduct();

        return CartResponseDto.builder()
                .cartNo(cart.getCartNo())
                .memNo(cart.getMember().getMemNo())
                .optionNo(option.getOptionNo())
                .cartQty(cart.getCartQty())
                .productName(product.getPrdName() + " " + option.getOptionValue())
                .productPrice(product.getPrdPrice() + (option.getAddPrice() != null ? option.getAddPrice() : 0))
                .productImage(product.getPrdImage())
                .build();
    }
}
