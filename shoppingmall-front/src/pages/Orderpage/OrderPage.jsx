import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../../css/OrderPage.css'; 
import { useOrder } from '../OrderContext'; 

// 주문자가 배송 정보를 입력하는 페이지 컴포넌트 (주문 프로세스 2단계)
function OrderPage() {
  const navigate = useNavigate();
  
  // 전역 주문 상태(OrderContext)에서 배송지 정보 state와 계산된 값을 가져옵니다.
  const {
    lastName, setLastName,
    firstName, setFirstName,
    phone, setPhone,
    postcode, setPostcode,
    address, setAddress,
    addressDetail, setAddressDetail,
    deliveryMessage, setDeliveryMessage,
    shippingFee, 
    orderSubtotal  // 상품 합계 금액 (배송비 계산에 사용)
  } = useOrder();
  
  // Daum Postcode API 스크립트 로드 여부 확인
  useEffect(() => {
    // window.daum 객체와 Postcode 함수가 있는지 확인하여 스크립트 오류를 방지합니다.
    if (!window.daum || !window.daum.Postcode) {
      console.error("Daum Postcode API 스크립트가 로드되지 않았습니다.");
    }
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  
  // 주소 검색 완료 시 우편번호와 주소를 Context state에 설정하는 핸들러
  const handleAddressSelect = (selectedPostcode, selectedAddress) => {
    setPostcode(selectedPostcode);
    setAddress(selectedAddress);
  };
  
  // Daum Postcode API 팝업을 띄우는 함수
  const handleOpenPopup = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data) {
          handleAddressSelect(data.zonecode, data.address);
        }
      }).open(); 
    } else {
      alert("주소 검색 API를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // '내 정보 불러오기' 기능: Mock 데이터를 Context state에 설정
  const handleLoadMyInfo = () => {
    // 실제 서비스에서는 DB에서 사용자 정보를 Fetch하여 사용합니다.
    const mockUserData = {
      lastName: "홍",
      firstName: "길동",
      phone: "010-8888-9999",
      postcode: "54321",
      address: "서울특별시",
      addressDetail: "101동 101호"
    };

    // 전역 Context state 업데이트
    setLastName(mockUserData.lastName);
    setFirstName(mockUserData.firstName);
    setPhone(mockUserData.phone);
    setPostcode(mockUserData.postcode);
    setAddress(mockUserData.address);
    setAddressDetail(mockUserData.addressDetail);
  };

  
  // 결제 페이지로 이동하기 전 필수 폼 필드 유효성 검사
  const handleToPayment = () => {
    if (!lastName || !firstName || !phone || !postcode || !address || !addressDetail) {
      alert('배송 정보를 모두 입력해주세요.');
    } else {
      // 모든 필드가 유효하면 결제 페이지로 라우팅
      navigate('/payment');
    }
  };

  // 배송비 무료 조건 계산 로직
  const freeShippingThreshold = 30000;
  const isShippingFree = orderSubtotal >= freeShippingThreshold;

  return (
    <div className="order-page">
      {/* --- 1. 상단 주문 진행 단계 표시 --- */}
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
        {/* --- 2. 왼쪽: 배송 정보 입력 폼 --- */}
        <div className="shipping-details">
          
          {/* 섹션 제목과 내 정보 불러오기 버튼을 포함하는 헤더 */}
          <div className="section-header">
            <h2>배송 정보</h2>
            <button 
              type="button" 
              className="btn-load-info" 
              onClick={handleLoadMyInfo} // 내 정보 불러오기 기능 실행
            >
              내 정보 불러오기
            </button>
          </div>

          <form className="shipping-form">
            {/* 성/이름 입력 그룹 */}
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
            {/* 휴대폰 번호 입력 그룹 */}
            <div className="form-group">
              <label htmlFor="phone">휴대폰 번호</label>
              <input type="text" id="phone" placeholder="010-1234-5678" 
                value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {/* 우편번호 및 주소 검색 버튼 그룹 */}
            <div className="form-group form-group-with-button">
              <div className="form-group">
                <label htmlFor="postcode">우편번호</label>
                <input type="text" id="postcode" placeholder="12345" 
                  value={postcode} readOnly /> {/* 주소 검색으로만 입력 가능 */}
              </div>
              <button type="button" className="btn-outline" onClick={handleOpenPopup}>
                주소 검색
              </button>
            </div>
            {/* 주소 입력 그룹 (검색 결과) */}
            <div className="form-group">
              <label htmlFor="address">주소</label>
              <input type="text" id="address" placeholder="서울시 강남구 테헤란로 123" 
                value={address} readOnly /> {/* 주소 검색으로만 입력 가능 */}
            </div>
            {/* 상세 주소 입력 그룹 */}
            <div className="form-group">
              <label htmlFor="address-detail">상세 주소</label>
              <input type="text" id="address-detail" placeholder="456호" 
                value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} />
            </div>
            {/* 배송 메시지 입력 그룹 */}
            <div className="form-group">
              <label htmlFor="delivery-message">배송 메시지</label>
              <input type="text" id="delivery-message" placeholder="배송 시 요청사항을 입력해주세요" 
                value={deliveryMessage} onChange={(e) => setDeliveryMessage(e.target.value)} />
            </div>
          </form>

          {/* 배송 방법 섹션 */}
          <h2>배송 방법</h2>
          <div className="shipping-method-box">
            <div className="method-title">
              <strong>일반 배송</strong>
              {/* 무료/유료 배송비 금액 표시 */}
              <span className={isShippingFree ? 'free' : 'fee'}>
                {isShippingFree ? '무료' : `${shippingFee.toLocaleString()}원`}
              </span>
            </div>
            <p>영업일 기준 2-3일 소요</p>
            {/* 무료 배송 조건 만족 여부에 따른 안내 메시지 */}
            {isShippingFree ? (
              <div className="shipping-highlight">✔ 무료 배송 가능</div>
            ) : (
              <div className="shipping-warning">
                30,000원을 채우지 못해 배송비 3,000원이 결제됩니다.
              </div>
            )}
          </div>
          {/* 배송 관련 기타 안내 사항 */}
          <p className="shipping-fine-print">
            30,000원 이상 구매 시 무료배송<br />
            제주도 및 도서산간 지역은 추가 배송비가 발생할 수 있습니다
          </p>
        </div>

        {/* --- 3. 오른쪽: 주문 요약 및 다음 단계 버튼 --- */}
        <div className="order-summary-sidebar">
          <div className="summary-box">
            <h3>배송지 확인</h3>
            <p>입력하신 정보를 확인한 후 다음 단계로 진행하세요.</p>
            {/* 결제 페이지로 이동하는 주 버튼 */}
            <button type="button" className="btn-primary" onClick={handleToPayment}>
              결제 정보 입력
            </button>
            {/* 이전 단계로 돌아가는 보조 버튼 (장바구니) */}
            <button type="button" className="btn-secondary">이전 단계</button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default OrderPage;