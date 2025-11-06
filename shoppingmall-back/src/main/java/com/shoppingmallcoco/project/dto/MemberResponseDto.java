package com.shoppingmallcoco.project.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberResponseDto {

    private Long memNo;
    private String memId;
    private String memNickname;
    private String memName;
    private String memMail;
    private String memHp;
    private String memZipcode;
    private String memAddress1;
    private String memAddress2;
    private LocalDateTime memJoindate;
    private String role;
    private Long point;
    private String token;  // JWT 토큰
}

