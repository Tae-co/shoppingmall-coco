package com.shoppingmallcoco.project.entity.mypage;

import com.shoppingmallcoco.project.entity.auth.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "SKIN")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkinProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "skin_seq")
    @SequenceGenerator(
            name = "skin_seq",
            sequenceName = "SKIN_SEQ",
            allocationSize = 1
    )
    @Column(name = "PROFILENO")
    private Long profileNo;

    @OneToOne
    @JoinColumn(name = "MEMNO", unique = true, nullable = false)
    private Member member;

    @Column(name = "SKINTYPE")
    private String skinType;

    @Column(name = "SKINCONCERN")
    private String skinConcern; // 예: "모공,여드름"

    @Column(name = "PERSONALCOLOR")
    private String personalColor;
}
