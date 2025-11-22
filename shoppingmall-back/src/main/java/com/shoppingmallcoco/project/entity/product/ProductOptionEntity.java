package com.shoppingmallcoco.project.entity.product;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "PRODUCTOPTION")
public class ProductOptionEntity {

    @Id
    @Column(name = "OPTIONNO")
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "productoptiontable_seq_generator")
    @SequenceGenerator(name="productoptiontable_seq_generator", sequenceName="PRODUCTOPTIONTABLE_SEQ", allocationSize=1)
    private Long optionNo;

    @Column(name = "OPTIONNAME")
    private String optionName;

    @Column(name = "OPTIONVALUE")
    private String optionValue;

    @Column(name = "STOCK")
    private int stock;

    @Column(name = "ADDPRICE")
    private int addPrice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRDNO", nullable = false)
    private ProductEntity product;

    // 재고 차감 (주문 시)
    public void removeStock(int quantity) {
        int restStock = this.stock - quantity;
        if (restStock < 0) {
            throw new RuntimeException("재고가 부족합니다. (현재 재고: " + this.stock + ")");
        }
        this.stock = restStock;
    }

    // 재고 복구 (주문 취소 시)
    public void addStock(int quantity) {
        this.stock += quantity;
    }
}
