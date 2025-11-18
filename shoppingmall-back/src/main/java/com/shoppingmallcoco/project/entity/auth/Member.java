package com.shoppingmallcoco.project.entity.auth;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@Table(name = "member")
public class Member {

    @Id
    @SequenceGenerator(
            name = "seq_member_memNo",
            sequenceName = "seq_member_memNo",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "seq_member_memNo"
    )
    @Column(name = "memNo")
    private Long memNo;

    @Column(name = "memId", nullable = false, unique = true, length = 50)
    private String memId;

    @Column(name = "memNickname", nullable = false, unique = true, length = 100)
    private String memNickname;

    @Column(name = "memPwd", nullable = false, length = 255)
    private String memPwd;

    @Column(name = "memName", length = 100)
    private String memName;

    @Column(name = "memMail", length = 100)
    private String memMail;

    @Column(name = "memHp", length = 100)
    private String memHp;

    @Column(name = "memZipcode", length = 100)
    private String memZipcode;

    @Column(name = "memAddress1", length = 100)
    private String memAddress1;

    @Column(name = "memAddress2", length = 100)
    private String memAddress2;

    @CreationTimestamp
    @Column(name = "memJoindate")
    private LocalDateTime memJoindate;

    @Column(name = "role", length = 20)
    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @Column(name = "point")
    private Long point = 0L;

    public enum Role {
        USER, ADMIN
    }


    public void usePoints(Long pointsToUse) {
        if (this.point < pointsToUse) {
            throw new RuntimeException("보유 포인트가 부족합니다.");
        }
        this.point -= pointsToUse;
    }


    public void returnPoints(Long pointsToReturn) {
        this.point += pointsToReturn;
    }
}