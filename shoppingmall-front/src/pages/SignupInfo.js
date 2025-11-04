import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SignupInfo.css';

const SignupInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    phoneNumber: '',
    email: ''
  });
  const [isIdChecked, setIsIdChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 아이디나 닉네임이 변경되면 중복확인 상태 초기화
    if (name === 'userId') {
      setIsIdChecked(false);
    }
    if (name === 'nickname') {
      setIsNicknameChecked(false);
    }
  };

  const handleCheckDuplicate = async (type) => {
    if (type === 'id') {
      if (formData.userId.length < 4) {
        alert('아이디는 4자 이상 입력해주세요.');
        return;
      }
      // 중복확인 API 호출 (구현 예정)
      console.log('아이디 중복확인:', formData.userId);
      setIsIdChecked(true);
      alert('사용 가능한 아이디입니다.');
    } else if (type === 'nickname') {
      if (formData.nickname.length < 2) {
        alert('닉네임은 2자 이상 입력해주세요.');
        return;
      }
      // 중복확인 API 호출 (구현 예정)
      console.log('닉네임 중복확인:', formData.nickname);
      setIsNicknameChecked(true);
      alert('사용 가능한 닉네임입니다.');
    }
  };

  const handlePhoneVerification = async () => {
    if (!formData.phoneNumber) {
      alert('휴대폰 번호를 입력해주세요.');
      return;
    }
    // 인증번호 전송 API 호출 (구현 예정)
    console.log('인증번호 전송:', formData.phoneNumber);
    setIsPhoneVerified(true);
    alert('인증번호가 전송되었습니다.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!isIdChecked) {
      alert('아이디 중복확인을 해주세요.');
      return;
    }
    if (formData.password.length < 8) {
      alert('비밀번호는 8자 이상 입력해주세요.');
      return;
    }
    if (formData.password !== formData.passwordConfirm) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (!isNicknameChecked) {
      alert('닉네임 중복확인을 해주세요.');
      return;
    }
    if (!isPhoneVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }

    // 회원가입 API 호출 (구현 예정)
    console.log('회원가입:', formData);
    alert('회원가입이 완료되었습니다.');
    navigate('/login');
  };

  const handleBack = () => {
    navigate('/signup/terms');
  };

  return (
    <div className="signup-info-container">
      <div className="signup-info-card">
        <div className="signup-info-header">
          <h1 className="signup-info-title">회원가입</h1>
          <p className="signup-info-subtitle">회원정보를 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="signup-info-body">
          <div className="input-group">
            <label>아이디 *</label>
            <div className="input-with-button">
              <input
                type="text"
                name="userId"
                placeholder="4자 이상 입력"
                value={formData.userId}
                onChange={handleInputChange}
                className="signup-input"
              />
              <button
                type="button"
                className="check-button"
                onClick={() => handleCheckDuplicate('id')}
              >
                중복확인
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>비밀번호 *</label>
            <input
              type="password"
              name="password"
              placeholder="8자 이상 입력"
              value={formData.password}
              onChange={handleInputChange}
              className="signup-input"
            />
          </div>

          <div className="input-group">
            <label>비밀번호 확인 *</label>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="비밀번호를 다시 입력"
              value={formData.passwordConfirm}
              onChange={handleInputChange}
              className="signup-input"
            />
          </div>

          <div className="input-group">
            <label>닉네임 *</label>
            <div className="input-with-button">
              <input
                type="text"
                name="nickname"
                placeholder="2자 이상 입력"
                value={formData.nickname}
                onChange={handleInputChange}
                className="signup-input"
              />
              <button
                type="button"
                className="check-button"
                onClick={() => handleCheckDuplicate('nickname')}
              >
                중복확인
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>휴대폰 번호 *</label>
            <div className="input-with-button">
              <input
                type="tel"
                name="phoneNumber"
                placeholder="01012345678"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="signup-input"
              />
              <button
                type="button"
                className="check-button"
                onClick={handlePhoneVerification}
              >
                인증번호
              </button>
            </div>
          </div>

          <div className="input-group">
            <label>이메일</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com (선택)"
              value={formData.email}
              onChange={handleInputChange}
              className="signup-input"
            />
          </div>

          <div className="button-group">
            <button type="button" className="back-button" onClick={handleBack}>
              취소
            </button>
            <button type="submit" className="submit-button">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupInfo;

