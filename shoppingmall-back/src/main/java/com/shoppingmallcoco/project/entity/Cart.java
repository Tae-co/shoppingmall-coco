package com.shoppingmallcoco.project.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Cart")
public class Cart {

    @Id
    @SequenceGenerator(
            name = "cart_seq_gen",
            sequenceName = "Cart_SEQ",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "cart_seq_gen"
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
    private ProductOption productOption;

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
    public static Cart create(Member member, ProductOption option, int qty) {
        Cart cart = new Cart();
        cart.member = member;
        cart.productOption = option;
        cart.cartQty = qty;
        return cart;
    }
}
