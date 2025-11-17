package com.shoppingmallcoco.project.dto.product;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Setter
public class ProductAdminRequestDTO {
    
	private String prdName;
    private String description;
    private Long categoryNo; 
    private int prdPrice;
    private int stock;
    
}