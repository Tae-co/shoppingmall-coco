import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/FindAccount.css';
import BackIcon from '../images/back.svg';

const FindAccount = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('id'); // 'id' or 'password'
  const [email, setEmail] = useState('');
  const [memId, setMemId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [timer, setTimer] = useState(0);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [foundId, setFoundId] = useState('');

  // 타이머 효과
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(timer => timer - 1);
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 탭 변경 시 상태 초기화
  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setEmail('');
    setMemId('');
    setVerificationCode('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setTimer(0);
    setIsVerified(false);
    setFoundId('');
    setIsSendingCode(false);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // 인증번호 전송
  const handleSendVerificationCode = async (e) => {
    e.preventDefault();

    if (activeTab === 'id') {
      // 아이디 찾기: 이메일만 필요
      if (!email.trim()) {
        alert('이메일을 입력해주세요.');
        return;
      }

      const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
      if (!emailRegex.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      setIsSendingCode(true);
      try {
        const response = await fetch('http://localhost:8080/api/member/find-id/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          setTimer(300); // 5분
          setIsVerified(false);
        } else {
          alert(data.message || '인증번호 전송에 실패했습니다.');
        }
      } catch (error) {
        console.error('인증번호 전송 오류:', error);
        alert('인증번호 전송 중 오류가 발생했습니다.');
      } finally {
        setIsSendingCode(false);
      }
    } else {
      // 비밀번호 찾기: 아이디 + 이메일 필요
      if (!memId.trim()) {
        alert('아이디를 입력해주세요.');
        return;
      }
      if (!email.trim()) {
        alert('이메일을 입력해주세요.');
        return;
      }

      const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
      if (!emailRegex.test(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
      }

      setIsSendingCode(true);
      try {
        const response = await fetch('http://localhost:8080/api/member/find-password/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ memId, email })
        });

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          setTimer(300); // 5분
          setIsVerified(false);
        } else {
          alert(data.message || '인증번호 전송에 실패했습니다.');
        }
      } catch (error) {
        console.error('인증번호 전송 오류:', error);
        alert('인증번호 전송 중 오류가 발생했습니다.');
      } finally {
        setIsSendingCode(false);
      }
    }
  };

  // 아이디 찾기 - 인증번호 검증
  const handleFindId = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/member/find-id/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          code: verificationCode
        })
      });

      const data = await response.json();

      if (data.success) {
        setFoundId(data.memId);
        setIsVerified(true);
        setTimer(0);
        alert('아이디 찾기가 완료되었습니다.');
      } else {
        alert(data.message || '인증번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('아이디 찾기 오류:', error);
      alert('아이디 찾기 중 오류가 발생했습니다.');
    }
  };

  // 비밀번호 재설정
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!verificationCode.trim()) {
      alert('인증번호를 입력해주세요.');
      return;
    }
    if (!newPassword.trim()) {
      alert('새 비밀번호를 입력해주세요.');
      return;
    }
    if (newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/member/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memId,
          email,
          code: verificationCode,
          newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('비밀번호가 재설정되었습니다. 로그인해주세요.');
        navigate('/login');
      } else {
        alert(data.message || '비밀번호 재설정에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 재설정 오류:', error);
      alert('비밀번호 재설정 중 오류가 발생했습니다.');
    }
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
              onClick={() => handleTabChange('id')}
            >
              아이디 찾기
            </button>
            <button
              className={`tab-button ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => handleTabChange('password')}
            >
              비밀번호 찾기
            </button>
          </div>

          {activeTab === 'id' ? (
            // 아이디 찾기 폼
            <>
              {!foundId ? (
                <form onSubmit={handleSendVerificationCode} className="find-account-form">
                  <div className="input-group">
                    <label>이메일 *</label>
                    <input
                      type="email"
                      placeholder="example@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="find-account-input"
                      disabled={timer > 0}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="verify-button"
                    disabled={isSendingCode || timer > 0}
                  >
                    {isSendingCode ? '전송중...' : timer > 0 ? `재전송(${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')})` : '인증번호 받기'}
                  </button>
                </form>
              ) : null}

              {timer > 0 && !foundId && (
                <form onSubmit={handleFindId} className="find-account-form" style={{ marginTop: '20px' }}>
                  <div className="input-group">
                    <label>인증번호 *</label>
                    <input
                      type="text"
                      placeholder="인증번호 6자리를 입력하세요"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="find-account-input"
                      maxLength="6"
                    />
                  </div>

                  <button type="submit" className="verify-button">
                    아이디 찾기
                  </button>
                </form>
              )}

              {foundId && (
                <div className="find-account-result">
                  <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h3 style={{ marginBottom: '10px' }}>아이디 찾기 결과</h3>
                    <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#155DFC' }}>
                      {foundId}
                    </p>
                    <button 
                      onClick={handleBackToLogin}
                      style={{
                        marginTop: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#030213',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      로그인하러 가기
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            // 비밀번호 찾기 폼
            <>
              {!isVerified ? (
                <>
                  <form onSubmit={handleSendVerificationCode} className="find-account-form">
                    <div className="input-group">
                      <label>아이디 *</label>
                      <input
                        type="text"
                        placeholder="아이디를 입력하세요"
                        value={memId}
                        onChange={(e) => setMemId(e.target.value)}
                        className="find-account-input"
                        disabled={timer > 0}
                      />
                    </div>

                    <div className="input-group">
                      <label>이메일 *</label>
                      <input
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="find-account-input"
                        disabled={timer > 0}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="verify-button"
                      disabled={isSendingCode || timer > 0}
                    >
                      {isSendingCode ? '전송중...' : timer > 0 ? `재전송(${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')})` : '인증번호 받기'}
                    </button>
                  </form>

                  {timer > 0 && (
                    <form onSubmit={handleResetPassword} className="find-account-form" style={{ marginTop: '20px' }}>
                      <div className="input-group">
                        <label>인증번호 *</label>
                        <input
                          type="text"
                          placeholder="인증번호 6자리를 입력하세요"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          className="find-account-input"
                          maxLength="6"
                        />
                      </div>

                      <div className="input-group">
                        <label>새 비밀번호 *</label>
                        <input
                          type="password"
                          placeholder="8자 이상 입력"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="find-account-input"
                        />
                      </div>

                      <div className="input-group">
                        <label>새 비밀번호 확인 *</label>
                        <input
                          type="password"
                          placeholder="비밀번호를 다시 입력"
                          value={newPasswordConfirm}
                          onChange={(e) => setNewPasswordConfirm(e.target.value)}
                          className="find-account-input"
                        />
                      </div>

                      <button type="submit" className="verify-button">
                        비밀번호 재설정
                      </button>
                    </form>
                  )}
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindAccount;

