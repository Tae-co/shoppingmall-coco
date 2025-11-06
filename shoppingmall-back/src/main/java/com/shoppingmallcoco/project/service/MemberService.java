package com.shoppingmallcoco.project.service;

import com.shoppingmallcoco.project.dto.MemberLoginDto;
import com.shoppingmallcoco.project.dto.MemberResponseDto;
import com.shoppingmallcoco.project.dto.MemberSignupDto;
import com.shoppingmallcoco.project.dto.FindIdDto;
import com.shoppingmallcoco.project.dto.ResetPasswordDto;
import com.shoppingmallcoco.project.entity.Member;
import com.shoppingmallcoco.project.repository.MemberRepository;
import com.shoppingmallcoco.project.service.EmailVerificationService;
import com.shoppingmallcoco.project.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {

    private final MemberRepository memberRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailVerificationService emailVerificationService;

    // 회원가입
    public MemberResponseDto signup(MemberSignupDto signupDto) {
        // 아이디 중복 확인
        if (memberRepository.existsByMemId(signupDto.getMemId())) {
            throw new RuntimeException("이미 사용 중인 아이디입니다.");
        }

        // 닉네임 중복 확인
        if (memberRepository.existsByMemNickname(signupDto.getMemNickname())) {
            throw new RuntimeException("이미 사용 중인 닉네임입니다.");
        }

        // 이메일 중복 확인 (이메일이 있는 경우)
        if (signupDto.getMemMail() != null && !signupDto.getMemMail().isEmpty()) {
            if (memberRepository.existsByMemMail(signupDto.getMemMail())) {
                throw new RuntimeException("이미 사용 중인 이메일입니다.");
            }
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(signupDto.getMemPwd());
        
        // DTO를 Entity로 변환
        Member member = Member.toEntity(signupDto);
        // 암호화된 비밀번호, role, point 설정
        member = member.toBuilder()
                .memPwd(encodedPassword)
                .role(Member.Role.USER)
                .point(0L)
                .build();

        // 저장
        Member savedMember = memberRepository.save(member);

        // 응답 DTO 변환
        return MemberResponseDto.builder()
                .memNo(savedMember.getMemNo())
                .memId(savedMember.getMemId())
                .memNickname(savedMember.getMemNickname())
                .memName(savedMember.getMemName())
                .memMail(savedMember.getMemMail())
                .memHp(savedMember.getMemHp())
                .memZipcode(savedMember.getMemZipcode())
                .memAddress1(savedMember.getMemAddress1())
                .memAddress2(savedMember.getMemAddress2())
                .memJoindate(savedMember.getMemJoindate())
                .role(savedMember.getRole() != null ? savedMember.getRole().name() : "USER")
                .point(savedMember.getPoint() != null ? savedMember.getPoint() : 0L)
                .build();
    }

    // 로그인
    @Transactional(readOnly = true)
    public MemberResponseDto login(MemberLoginDto loginDto) {
        Optional<Member> memberOpt = memberRepository.findByMemId(loginDto.getMemId());

        if (memberOpt.isEmpty()) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        Member member = memberOpt.get();

        // 비밀번호 확인
        if (!passwordEncoder.matches(loginDto.getMemPwd(), member.getMemPwd())) {
            throw new RuntimeException("아이디 또는 비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(member.getMemId(), member.getMemNo());

        // 응답 DTO 변환
        return MemberResponseDto.builder()
                .memNo(member.getMemNo())
                .memId(member.getMemId())
                .memNickname(member.getMemNickname())
                .memName(member.getMemName())
                .memMail(member.getMemMail())
                .memHp(member.getMemHp())
                .memZipcode(member.getMemZipcode())
                .memAddress1(member.getMemAddress1())
                .memAddress2(member.getMemAddress2())
                .memJoindate(member.getMemJoindate())
                .role(member.getRole() != null ? member.getRole().name() : "USER")
                .point(member.getPoint() != null ? member.getPoint() : 0L)
                .token(token)
                .build();
    }

    // 아이디 중복 확인
    @Transactional(readOnly = true)
    public boolean checkIdDuplicate(String memId) {
        return memberRepository.existsByMemId(memId);
    }

    // 닉네임 중복 확인
    @Transactional(readOnly = true)
    public boolean checkNicknameDuplicate(String memNickname) {
        return memberRepository.existsByMemNickname(memNickname);
    }

    // 이메일 중복 확인
    @Transactional(readOnly = true)
    public boolean checkEmailDuplicate(String memMail) {
        return memberRepository.existsByMemMail(memMail);
    }

    // 회원 정보 조회
    @Transactional(readOnly = true)
    public MemberResponseDto getMember(Long memNo) {
        Member member = memberRepository.findById(memNo)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        return MemberResponseDto.builder()
                .memNo(member.getMemNo())
                .memId(member.getMemId())
                .memNickname(member.getMemNickname())
                .memName(member.getMemName())
                .memMail(member.getMemMail())
                .memHp(member.getMemHp())
                .memZipcode(member.getMemZipcode())
                .memAddress1(member.getMemAddress1())
                .memAddress2(member.getMemAddress2())
                .memJoindate(member.getMemJoindate())
                .role(member.getRole() != null ? member.getRole().name() : "USER")
                .point(member.getPoint() != null ? member.getPoint() : 0L)
                .build();
    }

    // 아이디로 회원 정보 조회
    @Transactional(readOnly = true)
    public MemberResponseDto getMemberByMemId(String memId) {
        Member member = memberRepository.findByMemId(memId)
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        return MemberResponseDto.builder()
                .memNo(member.getMemNo())
                .memId(member.getMemId())
                .memNickname(member.getMemNickname())
                .memName(member.getMemName())
                .memMail(member.getMemMail())
                .memHp(member.getMemHp())
                .memZipcode(member.getMemZipcode())
                .memAddress1(member.getMemAddress1())
                .memAddress2(member.getMemAddress2())
                .memJoindate(member.getMemJoindate())
                .role(member.getRole() != null ? member.getRole().name() : "USER")
                .point(member.getPoint() != null ? member.getPoint() : 0L)
                .build();
    }

    // 아이디 찾기 - 이메일로 인증번호 발송
    public void sendFindIdVerificationCode(String email) {
        // 이메일로 회원 찾기
        Optional<Member> memberOpt = memberRepository.findByMemMail(email);
        if (memberOpt.isEmpty()) {
            throw new RuntimeException("해당 이메일로 등록된 회원을 찾을 수 없습니다.");
        }

        // 인증번호 발송
        emailVerificationService.generateVerificationCode(email);
    }

    // 아이디 찾기 - 인증번호 검증 후 아이디 반환
    @Transactional(readOnly = true)
    public String findId(FindIdDto findIdDto) {
        // 인증번호 검증
        boolean isValid = emailVerificationService.verifyCode(findIdDto.getEmail(), findIdDto.getCode());
        if (!isValid) {
            throw new RuntimeException("인증번호가 일치하지 않거나 만료되었습니다.");
        }

        // 이메일로 회원 찾기
        Member member = memberRepository.findByMemMail(findIdDto.getEmail())
                .orElseThrow(() -> new RuntimeException("회원을 찾을 수 없습니다."));

        return member.getMemId();
    }

    // 비밀번호 찾기 - 아이디와 이메일로 인증번호 발송
    public void sendResetPasswordVerificationCode(String memId, String email) {
        // 아이디와 이메일로 회원 찾기
        Optional<Member> memberOpt = memberRepository.findByMemId(memId);
        if (memberOpt.isEmpty()) {
            throw new RuntimeException("해당 아이디로 등록된 회원을 찾을 수 없습니다.");
        }

        Member member = memberOpt.get();
        
        // 이메일 일치 확인
        if (member.getMemMail() == null || !member.getMemMail().equals(email)) {
            throw new RuntimeException("아이디와 이메일이 일치하지 않습니다.");
        }

        // 인증번호 발송
        emailVerificationService.generateVerificationCode(email);
    }

    // 비밀번호 재설정
    public void resetPassword(ResetPasswordDto resetPasswordDto) {
        // 인증번호 검증
        boolean isValid = emailVerificationService.verifyCode(
                resetPasswordDto.getEmail(), 
                resetPasswordDto.getCode()
        );
        if (!isValid) {
            throw new RuntimeException("인증번호가 일치하지 않거나 만료되었습니다.");
        }

        // 아이디와 이메일로 회원 찾기
        Optional<Member> memberOpt = memberRepository.findByMemId(resetPasswordDto.getMemId());
        if (memberOpt.isEmpty()) {
            throw new RuntimeException("회원을 찾을 수 없습니다.");
        }

        Member member = memberOpt.get();
        
        // 이메일 일치 확인
        if (member.getMemMail() == null || !member.getMemMail().equals(resetPasswordDto.getEmail())) {
            throw new RuntimeException("아이디와 이메일이 일치하지 않습니다.");
        }

        // 새 비밀번호 암호화 및 저장
        String encodedPassword = passwordEncoder.encode(resetPasswordDto.getNewPassword());
        member = member.toBuilder()
                .memPwd(encodedPassword)
                .build();
        
        memberRepository.save(member);
    }
}

