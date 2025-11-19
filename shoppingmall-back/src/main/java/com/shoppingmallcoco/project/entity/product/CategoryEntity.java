package com.shoppingmallcoco.project.entity.product;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
@Table(name = "CATEGORY")
public class CategoryEntity {
	
	@Id
	@Column(name = "CATEGORYNO")
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "category_seq_gen")
	@SequenceGenerator(
        name = "category_seq_gen", 
        sequenceName = "CATEGORY_SEQ",
        allocationSize = 1
        )
	private Long categoryNo;
	
	@Column(name = "CATEGORYNAME")
	private String categoryName;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "PARENT_CATEGORY_NO")
	private CategoryEntity parentCategory;
	
	@OneToMany(mappedBy = "parentCategory", cascade = CascadeType.ALL, orphanRemoval = true)
	@JsonIgnore
	private List<CategoryEntity> children = new ArrayList<>();
	
	@OneToMany(mappedBy = "category")
	@JsonIgnore
	private List<ProductEntity> products = new ArrayList<>();
}
