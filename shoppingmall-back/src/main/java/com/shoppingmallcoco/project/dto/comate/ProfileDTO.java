package com.shoppingmallcoco.project.dto.comate;

import com.shoppingmallcoco.project.entity.auth.Member;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
public class ProfileDTO {
	// 사용자 기본 정보
    private Long memNo;
    private String memName;
    private String memNickname;
    
    // 팔로잉 관련 정보
    private int followerCount;
    private int followingCount;

    // 현재 사용자 확인
    private boolean isMyProfile;

}
