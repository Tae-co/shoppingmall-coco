package com.shoppingmallcoco.project.entity.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "orderitem") // DB 테이블명 (소문자)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "orderitem_seq_gen")
    @SequenceGenerator(name = "orderitem_seq_gen", sequenceName = "orderitem_SEQ", allocationSize = 1)
    @Column(name = "orderitemNo")
    private Long orderItemId;

    @Column(name = "prdNo", nullable = false)
    private Long prdNo;

    // --- [필수 추가] 옵션 번호 ---
    @Column(name = "OptionNo", nullable = false) // (DB 컬럼명: OptionNo)
    private Long optionNo;

    @Column(name = "price", nullable = false) // (DB 컬럼명 수정: price)
    private Long orderPrice;

    @Column(name = "qty", nullable = false) // (DB 컬럼명 수정: qty)
    private Long orderQty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderNo")
    private Order order;
}