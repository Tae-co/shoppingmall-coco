package com.shoppingmallcoco.project.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Table(name = "CartTable")
public class Cart {

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

    // 🔹 회원 (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "memNo", nullable = false)
    private Member member;

    // 🔹 상품 옵션 (FK)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "optionNo", nullable = false)
    private ProductOption productOption;

    // 🔹 수량
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
        return Cart.builder()
                .member(member)
                .productOption(option)
                .cartQty(qty)
                .build();
    }
}
