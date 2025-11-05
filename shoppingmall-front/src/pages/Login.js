import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Login.css';
import GoogleIcon from '../images/google.svg';
import NaverIcon from '../images/naver.svg';
import KakaoIcon from '../images/kakao.svg';
import LoginIcon from '../images/login.svg';

const Login = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!userId.trim()) {
      alert('아이디를 입력해주세요.');
      return;
    }
    if (!password.trim()) {
      alert('비밀번호를 입력해주세요.');
      return;
    }

    try {
      // 로그인 API 호출
      const response = await fetch('http://localhost:8080/api/member/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memId: userId,
          memPwd: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // 로그인 성공 - JWT 토큰과 사용자 정보를 localStorage에 저장
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        localStorage.setItem('member', JSON.stringify(data));
        localStorage.setItem('isLoggedIn', 'true');
        
        alert('로그인되었습니다.');
        
        // 로그인 상태 변경 이벤트 발생 (Header 컴포넌트가 감지)
        window.dispatchEvent(new Event('loginStatusChanged'));
        
        // 메인 페이지로 이동 (Header가 마운트되면서 자동으로 로그인 상태 체크)
        navigate('/');
      } else {
        alert(data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleFindAccount = (e) => {
    e.preventDefault();
    navigate('/find-account');
  };

  const handleSignup = (e) => {
    e.preventDefault();
    navigate('/signup/terms');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">Coco</h1>
          <p className="login-subtitle">계정에 로그인하세요</p>
        </div>

        <div className="login-body">
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label>아이디</label>
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="login-input"
              />
            </div>

            <div className="input-group">
              <label>비밀번호</label>
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
              />
            </div>

            <button type="submit" className="login-submit-button">
              <img src={LoginIcon} alt="로그인" className="login-icon" />
              로그인
            </button>
          </form>

          <div className="social-divider">
            <div className="divider-line"></div>
            <span className="divider-text">또는</span>
            <div className="divider-line"></div>
          </div>

          <div className="social-buttons">
            <button className="social-button">
              <img src={KakaoIcon} alt="Kakao" />
            </button>
            <button className="social-button">
              <img src={NaverIcon} alt="Naver" />
            </button>
            <button className="social-button">
              <img src={GoogleIcon} alt="Google" />
            </button>
          </div>

          <div className="find-account">
            <a href="#" className="find-link" onClick={handleFindAccount}>아이디 / 비밀번호 찾기</a>
          </div>
        </div>

        <div className="login-footer">
          <div className="footer-divider"></div>
          <div className="footer-signup">
            <span>아직 계정이 없으신가요?</span>
            <a href="#" className="signup-link" onClick={handleSignup}>회원가입</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

