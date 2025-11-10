package com.shoppingmallcoco.project.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequestDto {
    private Long memNo;
    private Long optionNo;
    private Integer cartQty;
}
