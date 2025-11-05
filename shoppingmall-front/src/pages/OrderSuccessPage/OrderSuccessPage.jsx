// src/pages/OrderSuccessPage/OrderSuccessPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/OrderResultPage.css'; // 공용 CSS 사용

// '보관함'에서 주문 정보를 가져옵니다.
import { useOrder } from '../../pages/OrderContext'; 

function OrderSuccessPage() {
  // 전역 '보관함'에서 결제 완료된 금액을 가져옵니다.
  const { orderSubtotal, shippingFee, pointsToUse } = useOrder();
  
  // --- ★ 2, 3, 4번 요청사항 반영 ★ ---
  const finalAmount = orderSubtotal + shippingFee - pointsToUse;
  
  // 2. 현재시각 기준으로 랜덤 주문번호 생성 (예: ORD-1730768602518)
  const orderNumber = `ORD-${new Date().getTime()}`;
  
  // 3. 현재 주문 일시 생성 (예: 2025년 11월 5일 15:30)
  const now = new Date();
  const orderDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  
  // 4. 결제 방법 변경
  const paymentMethod = "API간편 결제";
  // --- ★ 수정 끝 ★ ---

  return (
    <div className="order-result-page">

      <div className="result-icon-wrapper">
        <div className="result-icon success">
          <span>✔</span>
        </div>
      </div>
      
      <h1 className="result-title">주문이 완료되었습니다!</h1>
      <p className="result-subtitle">주문번호: {orderNumber}</p>

      {/* --- 주문 정보 박스 --- */}
      <div className="result-box order-info-box">
        <h2>주문 정보</h2>
        <div className="info-row">
          <span>주문 번호</span>
          <span>{orderNumber}</span>
        </div>
        <div className="info-row">
          <span>주문 일시</span>
          <span>{orderDate}</span>
        </div>
        <div className="info-row">
          <span>결제 방법</span>
          <span>{paymentMethod}</span>
        </div>
        <div className="info-total">
          <span>총 결제 금액</span>
          <span className="info-total-amount">₩{finalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* --- 다음 단계 박스 (1번 요청: CSS에서 왼쪽 정렬됨) --- */}
      <div className="result-box next-steps-box">
        <h2>다음 단계</h2>
        <div className="step-row">
          <span className="step-row-icon">📦</span>
          <div className="step-row-text">
            <h3>상품 준비</h3>
            <p>주문하신 상품을 준비하고 있습니다. (1-2 영업일)</p>
          </div>
        </div>
        <div className="step-row">
          <span className="step-row-icon">🚚</span>
          <div className="step-row-text">
            <h3>배송 시작</h3>
            <p>상품이 발송되면 SMS/이메일로 송장번호를 보내드립니다.</p>
          </div>
        </div>
        <div className="step-row">
          <span className="step-row-icon">✍️</span>
          <div className="step-row-text">
            <h3>배송 완료</h3>
            <p>상품 수령 후 리뷰를 남겨주시면 적립금을 드립니다.</p>
          </div>
        </div>
      </div>

      <div className="result-buttons">
        <Link to="/mypage" className="btn-primary-dark">주문 내역 보기</Link>
        <Link to="/" className="btn-secondary-light">쇼핑 계속하기</Link>
      </div>

    </div>
  );
}

export default OrderSuccessPage;