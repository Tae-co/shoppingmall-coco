package com.shoppingmallcoco.project.dto.mypage;

import com.shoppingmallcoco.project.entity.mypage.SkinProfile;
import lombok.Builder;
import lombok.Getter;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Getter
@Builder
public class SkinProfileResponseDto {

    private String skinType;
    private List<String> skinConcern;
    private String personalColor;

    public static SkinProfileResponseDto fromEntity(SkinProfile entity) {
        return SkinProfileResponseDto.builder()
                .skinType(entity.getSkinType())
                .skinConcern(
                        entity.getSkinConcern() != null ?
                                Arrays.asList(entity.getSkinConcern().split(",")) :
                                new ArrayList<>()
                )
                .personalColor(entity.getPersonalColor())
                .build();
    }
}
