package com.shoppingmallcoco.project.entity.comate;

import com.shoppingmallcoco.project.entity.Member;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FOLLOW")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Follow {

    @Id
    @Column(name = "FOLLOWNO")
    private Long followNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FOLLOWERNO")  // ← Oracle 컬럼명 그대로 사용!
    private Member follower;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FOLLOWINGNO") // ← Oracle 컬럼명 그대로 사용!
    private Member following;
}
