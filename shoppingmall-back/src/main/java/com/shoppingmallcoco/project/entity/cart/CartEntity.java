package com.shoppingmallcoco.project.entity.cart;

import com.shoppingmallcoco.project.entity.auth.Member;
import com.shoppingmallcoco.project.entity.product.ProductOptionEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "CartTable")
public class CartEntity {

    @Id
    @SequenceGenerator(
            name = "seq_cartTable_cartNo",
            sequenceName = "seq_cartTable_cartNo",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "seq_cartTable_cartNo"
    )
    @Column(name = "cartNo")
    private Long cartNo;

    // 회원 (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memNo", nullable = false)
    private Member member;

    // 상품 옵션 (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "optionNo", nullable = false)
    private ProductOptionEntity productOption;

    // 수량
    @Column(name = "cartQty", nullable = false)
    private Integer cartQty;

    // 수량 변경
    public void updateQuantity(int qty) {
        this.cartQty = qty;
    }

    // 수량 추가
    public void addQuantity(int qty) {
        this.cartQty += qty;
    }
    // cart 생성
    public static CartEntity create(Member member, ProductOptionEntity option, int qty) {
        CartEntity cart = new CartEntity();
        cart.member = member;
        cart.productOption = option;
        cart.cartQty = qty;
        return cart;
    }
}

