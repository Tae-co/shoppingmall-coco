package com.shoppingmallcoco.project.entity.product;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "PRODUCTTABLE")
public class ProductEntity {
	
	@Id
	@Column(name = "PRDNO")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "product_seq_generator")
    @SequenceGenerator(name="product_seq_generator", sequenceName="PRODUCT_SEQ", allocationSize=1)
	private Long prdNo;
	
	@Column(name = "PRDNAME")
	private String prdName;
	
	@Column(name = "PRDPRICE")
	private int prdPrice;
	
	@Lob
	@Column(name = "DESCRIPTION")
	private String description;
	
	@Column(name = "HOWTOUSE")
	private String howToUse;
	
	@Column(name = "REG_DATE")
	private LocalDate regDate;
	
	@Column(name = "SKINTYPE")
    private String skinType;
	
    @Column(name = "SKINCONCERN")
    private String skinConcern;
    
    @Column(name = "PERSONALCOLOR")
    private String personalColor;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "CATEGORY_NO", nullable = false)
	private CategoryEntity category;
	
	@OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
	private List<ProductOptionEntity> options;
	
	@OneToMany(mappedBy = "product", fetch = FetchType.LAZY)
    @OrderBy("sortOrder ASC") // 이미지 순서(sortOrder)대로 정렬 1번이 썸네일
    private List<ProductImageEntity> images;

}
