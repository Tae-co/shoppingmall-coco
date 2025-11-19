package com.shoppingmallcoco.project.dto.mypage;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ProfileUpdateRequestDto {
    private String skinType;
    private List<String> concerns;
    private String personalColor;
}