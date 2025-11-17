package com.shoppingmallcoco.project.entity.comate;

import com.shoppingmallcoco.project.entity.Member;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "follow")
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 팔로워: 나를 팔로우 하는 사용자
    @ManyToOne
    @JoinColumn(name = "follower_memNo")
    private Member follower;

    // 팔로잉: 내가 팔로우 하는 사용자
    @ManyToOne
    @JoinColumn(name = "following_memNo")
    private Member following;
}
