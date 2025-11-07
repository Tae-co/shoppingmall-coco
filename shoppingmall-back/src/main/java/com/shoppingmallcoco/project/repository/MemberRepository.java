package com.shoppingmallcoco.project.repository;

import com.shoppingmallcoco.project.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {

    // 아이디로 회원 찾기
    Optional<Member> findByMemId(String memId);

    // 이메일로 회원 찾기
    Optional<Member> findByMemMail(String memMail);

    // 아이디 중복 확인
    boolean existsByMemId(String memId);

    // 닉네임 중복 확인
    boolean existsByMemNickname(String memNickname);

    // 이메일 중복 확인
    boolean existsByMemMail(String memMail);
}


