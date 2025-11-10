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
@Table(name = "ProductTable")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_product")
    @SequenceGenerator(name = "seq_product", sequenceName = "seq_product", allocationSize = 1)
    @Column(name = "prdNo")
    private Long prdNo;

    @Column(name = "prdName", nullable = false)
    private String prdName;

    @Column(name = "prdPrice", nullable = false)
    private Integer prdPrice;

    @Column(name = "prdImage")
    private String prdImage;
}
