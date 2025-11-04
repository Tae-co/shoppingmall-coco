import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SignupTerms.css';

const SignupTerms = () => {
  const navigate = useNavigate();
  const [allAgreed, setAllAgreed] = useState(false);
  const [serviceAgreed, setServiceAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);

  // 전체 동의 체크박스 상태 업데이트
  useEffect(() => {
    if (serviceAgreed && privacyAgreed && marketingAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  }, [serviceAgreed, privacyAgreed, marketingAgreed]);

  // 전체 동의 클릭 시 모든 항목 체크/해제
  const handleAllAgreed = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setServiceAgreed(newValue);
    setPrivacyAgreed(newValue);
    setMarketingAgreed(newValue);
  };

  // 필수 항목이 모두 체크되었는지 확인
  const isRequiredAgreed = serviceAgreed && privacyAgreed;

  const handleCancel = () => {
    navigate('/login');
  };

  const handleNext = () => {
    if (isRequiredAgreed) {
      navigate('/signup/info');
    }
  };

  const handleViewTerms = (type) => {
    // 약관 보기 모달 또는 페이지 (구현 예정)
    console.log('약관 보기:', type);
  };

  return (
    <div className="signup-terms-container">
      <div className="signup-terms-card">
        <div className="signup-terms-header">
          <h1 className="signup-terms-title">회원가입</h1>
          <p className="signup-terms-subtitle">약관에 동의해주세요</p>
        </div>

        <div className="signup-terms-body">
          <div className="terms-section">
            <div 
              className="all-agree-item"
              onClick={handleAllAgreed}
            >
              <div className={`checkbox ${allAgreed ? 'checked' : ''}`}>
                {allAgreed && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 3L4.5 8.5L2 6" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span className="all-agree-text">전체 동의</span>
            </div>

            <div className="terms-list">
              <div className="term-item">
                <div className="term-checkbox-wrapper">
                  <div 
                    className={`checkbox ${serviceAgreed ? 'checked' : ''}`}
                    onClick={() => setServiceAgreed(!serviceAgreed)}
                  >
                    {serviceAgreed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="term-label">[필수] 서비스 이용약관</span>
                </div>
                <button 
                  className="view-button"
                  onClick={() => handleViewTerms('service')}
                >
                  보기
                </button>
              </div>

              <div className="term-item">
                <div className="term-checkbox-wrapper">
                  <div 
                    className={`checkbox ${privacyAgreed ? 'checked' : ''}`}
                    onClick={() => setPrivacyAgreed(!privacyAgreed)}
                  >
                    {privacyAgreed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="term-label">[필수] 개인정보 처리방침</span>
                </div>
                <button 
                  className="view-button"
                  onClick={() => handleViewTerms('privacy')}
                >
                  보기
                </button>
              </div>

              <div className="term-item">
                <div className="term-checkbox-wrapper">
                  <div 
                    className={`checkbox ${marketingAgreed ? 'checked' : ''}`}
                    onClick={() => setMarketingAgreed(!marketingAgreed)}
                  >
                    {marketingAgreed && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="#0A0A0A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="term-label">[선택] 마케팅 정보 수신 동의</span>
                </div>
              </div>
            </div>
          </div>

          <div className="button-group">
            <button className="cancel-button" onClick={handleCancel}>
              취소
            </button>
            <button 
              className={`next-button ${isRequiredAgreed ? 'active' : ''}`}
              onClick={handleNext}
              disabled={!isRequiredAgreed}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupTerms;

