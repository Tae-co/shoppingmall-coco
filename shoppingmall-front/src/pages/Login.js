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

  const handleSubmit = (e) => {
    e.preventDefault();
    // 로그인 로직 구현 예정
    console.log('로그인 시도:', { userId, password });
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

