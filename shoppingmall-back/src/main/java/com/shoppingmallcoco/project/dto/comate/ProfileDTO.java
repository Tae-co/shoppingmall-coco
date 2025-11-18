package com.shoppingmallcoco.project.dto.comate;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileDTO {
	
	private Long memNo;
	private String memName;
	private String memNickname;
	
	private boolean isMyProfile;
}
