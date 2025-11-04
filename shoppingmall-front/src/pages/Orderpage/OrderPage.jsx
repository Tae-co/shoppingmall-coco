import React, { useState } from 'react';
import '../../css/OrderPage.css'; 
import AddressPopup from './AddressPopup'; 

function OrderPage() {
  // 배송비 계산을 위한 state (초기값 25,000원으로 설정)
  const [totalPrice, setTotalPrice] = useState(25000); 

  // 팝업창을 띄우기 위한 state (기본값: false 안보임)
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // --- 1. 우편번호와 주소를 위한 state 추가  ---
  const [postcode, setPostcode] = useState(''); // 우편번호 state
  const [address, setAddress] = useState('');   // 주소 state
  

  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  // --- 2. 팝업에서 주소를 선택했을 때 실행될 함수  ---
  const handleAddressSelect = (selectedPostcode, selectedAddress) => {
    setPostcode(selectedPostcode); // 1. state에 우편번호 저장
    setAddress(selectedAddress);   // 2. state에 주소 저장
    
  };

  // 배송비 로직
  const shippingFee = 3000;
  const freeShippingThreshold = 30000;
  const isShippingFree = totalPrice >= freeShippingThreshold;

  return (
    <div className="order-page">
      {/* --- 1. 상단 진행 단계 --- */}
      <div className="checkout-progress">
        <div className="step-item complete">
          <span className="step-icon">✔</span>
          <span className="step-label">장바구니</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item active">
          <span className="step-icon">2</span>
          <span className="step-label">배송 정보</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item">
          <span className="step-icon">3</span>
          <span className="step-label">결제</span>
        </div>
        <div className="step-connector"></div>
        <div className="step-item">
          <span className="step-icon">4</span>
          <span className="step-label">주문 완료</span>
        </div>
      </div>

      <h1>주문하기</h1>

      <div className="order-content-wrapper">
        {/* --- 2. 왼쪽 배송 정보 입력 --- */}
        <div className="shipping-details">
          <h2>배송 정보</h2>
          <form className="shipping-form">
            <div className="form-group-half">
              <div className="form-group">
                <label htmlFor="last-name">성</label>
                <input type="text" id="last-name" placeholder="김" />
              </div>
              <div className="form-group">
                <label htmlFor="first-name">이름</label>
                <input type="text" id="first-name" placeholder="민수" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">휴대폰 번호</label>
              <input type="text" id="phone" placeholder="010-1234-5678" />
            </div>
            <div className="form-group form-group-with-button">
              <div className="form-group">
                <label htmlFor="postcode">우편번호</label>
                {/* ---  3. input에 value={postcode} 추가  --- */}
                <input 
                  type="text" 
                  id="postcode" 
                  placeholder="12345" 
                  value={postcode} // state와 연결
                  readOnly // 사용자가 직접 수정 못하게
                />
              </div>
              <button 
                type="button" 
                className="btn-outline" 
                onClick={handleOpenPopup}
              >
                주소 검색
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="address">주소</label>
              {/* ---  4. input에 value={address} 추가  --- */}
              <input 
                type="text" 
                id="address" 
                placeholder="서울시 강남구 테헤란로 123" 
                value={address} // state와 연결
                readOnly // 사용자가 직접 수정 못하게
              />
            </div>
            <div className="form-group">
              <label htmlFor="address-detail">상세 주소</label>
              <input type="text" id="address-detail" placeholder="456호" />
            </div>
            <div className="form-group">
              <label htmlFor="delivery-message">배송 메시지</label>
              <input type="text" id="delivery-message" placeholder="배송 시 요청사항을 입력해주세요" />
            </div>
          </form>

          <h2>배송 방법</h2>
          <div className="shipping-method-box">
            <div className="method-title">
              <strong>일반 배송</strong>
              <span className={isShippingFree ? 'free' : 'fee'}>
                {isShippingFree ? '무료' : `${shippingFee.toLocaleString()}원`}
              </span>
            </div>
            <p>영업일 기준 2-3일 소요</p>

            {isShippingFree ? (
              <div className="shipping-highlight">
                ✔ 무료 배송 가능
              </div>
            ) : (
              <div className="shipping-warning">
                30,000원을 채우지 못해 배송비 3,000원이 결제됩니다.
              </div>
            )}
          </div>
          
          <p className="shipping-fine-print">
            30,000원 이상 구매 시 무료배송<br />
            제주도 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다
          </p>
        </div>

        {/* --- 3. 오른쪽 배송지 확인 --- */}
        <div className="order-summary-sidebar">
          <div className="summary-box">
            <h3>배송지 확인</h3>
            <p>입력하신 정보를 확인한 후 다음 단계로 진행하세요.</p>
            <button type="button" className="btn-primary">결제 정보 입력</button>
            <button type="button" className="btn-secondary">이전 단계</button>
          </div>
        </div>
      </div>

      {/* --- 5. 팝업에 onSelect 함수 물려주기 ★ --- */}
      {isPopupOpen && (
        <AddressPopup 
          onClose={handleClosePopup} 
          onSelect={handleAddressSelect} // ★ 이 prop 추가
        />
      )}

    </div>
  );
}

export default OrderPage;