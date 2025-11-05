import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../css/OrderPage.css'; 
import AddressPopup from './AddressPopup'; 

// 1. '보관함'을 한 단계 상위 폴더(pages)에서 가져옵니다.
import { useOrder } from '../OrderContext';

function OrderPage() {
  const navigate = useNavigate();
  
  // 2. '보관함(useOrder)'에서 모든 폼 state와 함수를 가져옵니다.
  const {
    lastName, setLastName,
    firstName, setFirstName,
    phone, setPhone,
    postcode, setPostcode,
    address, setAddress,
    addressDetail, setAddressDetail,
    deliveryMessage, setDeliveryMessage,
    shippingFee, // 배송비도 보관함에서 가져옴
    orderSubtotal  // 상품금액도 보관함에서 가져옴
  } = useOrder();
  
  // 팝업 state는 OrderPage에서만 사용하므로 여기에 둡니다.
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 배송비 로직을 '보관함'에서 가져온 값으로 계산
  const freeShippingThreshold = 30000;
  const isShippingFree = orderSubtotal >= freeShippingThreshold;


  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  // 이 함수는 '전역' state를 변경합니다.
  const handleAddressSelect = (selectedPostcode, selectedAddress) => {
    setPostcode(selectedPostcode);
    setAddress(selectedAddress);
  };

  // 이 함수는 '전역' state를 검사합니다.
  const handleToPayment = () => {
    if (!lastName || !firstName || !phone || !postcode || !address || !addressDetail) {
      alert('배송 정보를 모두 입력해주세요.');
    } else {
      navigate('/payment');
    }
  };

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
          {/* 폼 부분은 수정할 필요가 없습니다. 
            value와 onChange가 이제 '전역 보관함'의 데이터를 사용합니다!
          */}
          <form className="shipping-form">
            <div className="form-group-half">
              <div className="form-group">
                <label htmlFor="last-name">성</label>
                <input type="text" id="last-name" placeholder="김" 
                  value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="first-name">이름</label>
                <input type="text" id="first-name" placeholder="민수" 
                  value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="phone">휴대폰 번호</label>
              <input type="text" id="phone" placeholder="010-1234-5678" 
                value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="form-group form-group-with-button">
              <div className="form-group">
                <label htmlFor="postcode">우편번호</label>
                <input type="text" id="postcode" placeholder="12345" 
                  value={postcode} readOnly />
              </div>
              <button type="button" className="btn-outline" onClick={handleOpenPopup}>
                주소 검색
              </button>
            </div>
            <div className="form-group">
              <label htmlFor="address">주소</label>
              <input type="text" id="address" placeholder="서울시 강남구 테헤란로 123" 
                value={address} readOnly />
            </div>
            <div className="form-group">
              <label htmlFor="address-detail">상세 주소</label>
              <input type="text" id="address-detail" placeholder="456호" 
                value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="delivery-message">배송 메시지</label>
              <input type="text" id="delivery-message" placeholder="배송 시 요청사항을 입력해주세요" 
                value={deliveryMessage} onChange={(e) => setDeliveryMessage(e.target.value)} />
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
              <div className="shipping-highlight">✔ 무료 배송 가능</div>
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
            <button type="button" className="btn-primary" onClick={handleToPayment}>
              결제 정보 입력
            </button>
            <button type="button" className="btn-secondary">이전 단계</button>
          </div>
        </div>
      </div>

      {/* --- 팝업창 렌더링 --- */}
      {isPopupOpen && (
        <AddressPopup 
          onClose={handleClosePopup} 
          onSelect={handleAddressSelect} 
        />
      )}
    </div>
  );
}

export default OrderPage;