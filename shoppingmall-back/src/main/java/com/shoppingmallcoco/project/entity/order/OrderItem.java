package com.shoppingmallcoco.project.entity.order;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "orderItem")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderItemId")
    private Integer orderItemId;

    @Column(name = "prdNo", nullable = false)
    private Integer prdNo;

    @Column(nullable = false)
    private Integer orderPrice;

    @Column(name = "orderQty", nullable = false)
    private Integer orderQty;

    // --- (관계 설정) ---
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderNo")
    private Order order;


}