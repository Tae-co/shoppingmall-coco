package com.shoppingmallcoco.project.dto.mypage;

import com.shoppingmallcoco.project.entity.mypage.SkinProfile;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ProfileResponseDto {

    private String skinType;       // 지성/건성/복합성 등
    private String[] concerns;     // ["모공","여드름","건조함"]
    private String personalColor;  // 퍼스널 컬러

    public static ProfileResponseDto of(SkinProfile skin) {

        if (skin == null) {
            return ProfileResponseDto.builder()
                    .skinType("")
                    .concerns(new String[]{})
                    .personalColor("")
                    .build();
        }

        return ProfileResponseDto.builder()
                .skinType(skin.getSkinType())
                .concerns(skin.getSkinConcern() != null
                        ? skin.getSkinConcern().split(",")
                        : new String[]{})
                .personalColor(skin.getPersonalColor())
                .build();
    }
}