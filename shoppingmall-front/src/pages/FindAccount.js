import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FindAccount.css';
import BackIcon from '../images/back.svg';

const FindAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('id'); // 'id' or 'password'
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 인증번호 받기 로직 구현 예정
    console.log('인증번호 받기:', { activeTab, phoneNumber });
  };

  return (
    <div className="find-account-container">
      <div className="find-account-card">
        <div className="find-account-header">
          <button className="back-button" onClick={handleBackToLogin}>
            <img src={BackIcon} alt="뒤로가기" />
            <span>로그인으로 돌아가기</span>
          </button>
          <h1 className="find-account-title">계정 찾기</h1>
          <p className="find-account-subtitle">아이디 또는 비밀번호를 찾으세요</p>
        </div>

        <div className="find-account-body">
          <div className="tab-container">
            <button
              className={`tab-button ${activeTab === 'id' ? 'active' : ''}`}
              onClick={() => setActiveTab('id')}
            >
              아이디 찾기
            </button>
            <button
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              비밀번호 찾기
            </button>
          </div>

          <form onSubmit={handleSubmit} className="find-account-form">
            <div className="input-group">
              <label>휴대폰 번호</label>
              <input
                type="tel"
                placeholder="01012345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="find-account-input"
              />
            </div>

            <button type="submit" className="verify-button">
              인증번호 받기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindAccount;

