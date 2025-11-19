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
}
