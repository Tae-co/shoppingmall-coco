package com.shoppingmallcoco.project.dto.comate;

import com.shoppingmallcoco.project.entity.Member;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class ProfileDTO {
    private Long memNo;
    private String memName;
    private String memNickname;

    private int followerCount;
    private int followingCount;

    private boolean isMyProfile;

    private List<FollowInfoDTO> followers;
    private List<FollowInfoDTO> followings;
}
