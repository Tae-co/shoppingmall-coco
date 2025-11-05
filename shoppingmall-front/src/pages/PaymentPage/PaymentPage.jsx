// 1. { useEffect } 가 import 목록에서 제거되었습니다.
import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import '../../css/PaymentPage.css'; 
import { useOrder } from '../OrderContext';
import TermsPopup from './TermsPopup'; 

function PaymentPage() {
  const navigate = useNavigate();

  // '보관함'에서 필요한 정보는 그대로 가져옵니다.
  const {
    orderSubtotal,
    shippingFee,
    userPoints,
    pointsToUse, setPointsToUse
  } = useOrder();

  // (기존 state: paymentMethod, agreements, isTermsPopupOpen 등은 동일)
  const [paymentMethod, setPaymentMethod] = useState('api');
  const [agreements, setAgreements] = useState({
    purchase: false,
    info: false
  });
  const [isTermsPopupOpen, setIsTermsPopupOpen] = useState(false);
  
  // --- ★ 1. [수정] 카드 정보 폼을 위한 state 4개 추가 ★ ---
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  // --- ★ 수정 끝 ★ ---

  const handleOpenTermsPopup = () => setIsTermsPopupOpen(true);
  const handleCloseTermsPopup = () => setIsTermsPopupOpen(false);

  // 'useEffect' API 초기화 코드는 삭제된 상태입니다.
  
  // (기존 로직: totalAmount, finalAmount, 포인트/약관 함수 등은 동일)
  const totalAmount = orderSubtotal + shippingFee; 
  const finalAmount = totalAmount - pointsToUse;   
  const handlePointsChange = (e) => {
    let value = Number(e.target.value);
    if (value < 0) value = 0;
    if (value > userPoints) value = userPoints;
    if (value > totalAmount) value = totalAmount;
    setPointsToUse(value); 
  };
  const handleUseAllPoints = () => {
    const maxUsablePoints = Math.min(userPoints, totalAmount);
    setPointsToUse(maxUsablePoints); 
  };
  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements(prev => ({ ...prev, [name]: checked }));
  };

  // --- ★ 2. [수정] '결제하기' 버튼 핸들러에 '카드 정보' 유효성 검사 추가 ★ ---
  const handlePaymentSubmit = () => {
    // (약관 동의 검사)
    if (!agreements.purchase || !agreements.info) {
      alert("필수 약관에 모두 동의해주세요.");
      return;
    }
    
    if (paymentMethod === 'api') {
      // --- 1. 'API 간편결제'일 경우 (잠시 대기 후 성공) ---
      console.log("결제를 진행합니다... (테스트 대기)");
      setTimeout(() => {
        navigate('/order-success');
      }, 2000); // 2초 딜레이

    } else if (paymentMethod === 'card') {
      // --- 2. '신용/체크카드'일 경우 (필수값 검사 후 실패) ---
      
      // ★ 카드 정보 4개 항목이 비어있는지 검사 ★
      if (!cardNumber || !cardName || !cardExpiry || !cardCvc) {
        alert("카드 정보를 모두 입력해주세요.");
        return; // 함수 종료
      }

      // ★ 검사를 통과했다면, 요청대로 '실패' 처리 ★
      console.log("현재 '신용/체크카드 직접 입력'은 지원하지 않습니다.");
      navigate('/order-fail'); // 실패 페이지로 이동
    }
  };
  // --- ★ 수정 끝 ★ ---
  
  return (
    <div className="payment-page">
      
      {/* --- 상단 진행 단계 --- */}
      <div className="checkout-progress">
        <div className="step-item complete">
          <span className="step-icon">✔</span><span className="step-label">장바구니</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item complete">
          <span className="step-icon">✔</span><span className="step-label">배송 정보</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item active">
          <span className="step-icon">3</span><span className="step-label">결제</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item">
          <span className="step-icon">4</span><span className="step-label">주문 완료</span>
        </div>
      </div>

      <h1>주문하기</h1>

      <div className="payment-content-wrapper">
        {/* --- 왼쪽 결제 정보 입력 --- */}
        <div className="payment-details">
          <h2>결제 수단 선택</h2>
          <div className="payment-method-options">
            <div 
              className={`method-option ${paymentMethod === 'api' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('api')}
            >
              <span className="radio-icon"></span> API 간편결제 (포트원/토스 등)
            </div>
            <div 
              className={`method-option ${paymentMethod === 'card' ? 'selected' : ''}`}
              onClick={() => setPaymentMethod('card')}
            >
              <span className="radio-icon"></span> 신용/체크카드 직접 입력
            </div>
          </div>

          {/* --- ★ 3. [수정] '카드 정보' 폼에 value와 onChange 연결 ★ --- */}
          {paymentMethod === 'card' && (
            <div className="card-info-section">
              <h2>카드 정보</h2>
              <form className="card-form">
                <div className="form-group">
                  <label htmlFor="card-number">카드 번호</label>
                  <input 
                    type="text" 
                    id="card-number" 
                    placeholder="1234 5678 9012 3456" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="card-name">카드 소유자명</label>
                  <input 
                    type="text" 
                    id="card-name" 
                    placeholder="HONG GIL DONG" 
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div className="form-group-half">
                  <div className="form-group">
                    <label htmlFor="card-expiry">만료일</label>
                    <input 
                      type="text" 
                      id="card-expiry" 
                      placeholder="MM/YY" 
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="card-cvc">CVC</label>
                    <input 
                      type="text" 
                      id="card-cvc" 
                      placeholder="123" 
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                    />
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* --- 포인트 사용 폼 --- */}
          <div className="points-section">
            <h2>포인트 사용</h2>
            <div className="points-form form-group-with-button">
              <input 
                type="number" 
                placeholder="0"
                value={pointsToUse || ''} 
                onChange={handlePointsChange}
              />
              <button type="button" className="btn-outline" onClick={handleUseAllPoints}>
                모두 사용
              </button>
            </div>
            <p className="points-info">보유 포인트: {userPoints.toLocaleString()} P</p>
          </div>
          
          {/* --- 약관 동의 --- */}
          <div className="agreement-section">
            <div className="agreement-item">
              <input 
                type="checkbox" 
                id="agree-purchase" 
                name="purchase"
                checked={agreements.purchase}
                onChange={handleAgreementChange}
              />
              <label htmlFor="agree-purchase">구매조건 및 결제대행 서비스 약관 동의 (필수)</label>
            </div>
            <div className="agreement-item">
              <input 
                type="checkbox" 
                id="agree-info" 
                name="info"
                checked={agreements.info}
                onChange={handleAgreementChange}
              />
              <label htmlFor="agree-info">개인정보 제공 및 처리 동의 (필수)</label>
            </div>
            <span className="agreement-link" onClick={handleOpenTermsPopup}>
              약관 보기
            </span>
          </div>
        </div>

        {/* --- 오른쪽 최종 결제 금액 --- */}
        <div className="order-summary-sidebar">
          <div className="summary-box">
            <h3>최종 결제 금액</h3>
            <div className="summary-row">
              <span>상품 금액</span>
              <span>₩{orderSubtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>배송비</span>
              <span>₩{shippingFee.toLocaleString()}</span>
            </div>
            
            {pointsToUse > 0 && (
              <div className="summary-row discount">
                <span>포인트 사용</span>
                <span>- ₩{pointsToUse.toLocaleString()}</span>
              </div>
            )}
            
            <div className="summary-total">
              <span>총 결제 금액</span>
              <span>₩{finalAmount.toLocaleString()}</span>
            </div>
            
            <button 
              type="button" 
              className="btn-primary"
              onClick={handlePaymentSubmit} // ★ 이 버튼이 유효성 검사를 호출합니다
            >
              ₩{finalAmount.toLocaleString()} 결제하기
            </button>
            <button 
              type="button" 
              className="btn-secondary"
              onClick={() => navigate('/order')}
            >
              이전 단계
            </button>
            <p className="summary-note">
              주문 완료 후 주문 취소/변경이 어려울 수 있습니다.
              주문 내용을 다시 한 번 확인해주세요.
            </p>
          </div>
        </div>
      </div>

      {/* --- 약관 팝업 --- */}
      {isTermsPopupOpen && <TermsPopup onClose={handleCloseTermsPopup} />}
    </div>
  );
}

export default PaymentPage;