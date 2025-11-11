package com.shoppingmallcoco.project.entity.product;

import java.util.List;

import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Getter
@Table(name = "CATEGORYTABLE")
public class CategoryEntity {
	
	@Id
	@Column(name = "CATEGORYNO")
	private Long categoryNo;
	
	@Column(name = "CATEGORYNAME")
	private String categoryName;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "PARENT_CATEGORY_NO")
	private CategoryEntity parentCategory;
	
	@OneToMany(mappedBy = "category")
	private List<ProductEntity> products;
}
