package com.shoppingmallcoco.project.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Table(name = "ProductOptionTable")
public class ProductOption {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_option")
    @SequenceGenerator(name = "seq_option", sequenceName = "seq_option", allocationSize = 1)
    @Column(name = "optionNo")
    private Long optionNo;

    // ✅ 상품 FK 연결 (CartResponseDto에서 product 사용하려면 반드시 필요)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prdNo", nullable = false)
    private Product product;

    @Column(name = "optionName")
    private String optionName;

    @Column(name = "optionValue")
    private String optionValue;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "addPrice")
    private Integer addPrice;
}