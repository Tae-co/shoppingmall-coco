package com.shoppingmallcoco.project.entity.product;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "PRODUCTOPTION")
public class ProductOptionEntity {
	
	@Id
	@Column(name = "OPTIONNO")
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
