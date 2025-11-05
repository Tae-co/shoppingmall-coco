// src/pages/OrderFailPage/OrderFailPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/OrderResultPage.css'; // 공용 CSS 사용

function OrderFailPage() {
  
  // (오류 코드는 더 이상 사용되지 않습니다)
  // const errorCode = "ERR-A3B2C1";

  return (
    <div className="order-result-page">

      <div className="result-icon-wrapper">
        <div className="result-icon fail">
          <span>!</span>
        </div>
      </div>
      
      <h1 className="result-title">주문 처리 실패</h1>
      <p className="result-subtitle">결제가 거부되었습니다</p>

      {/* --- ★ 1. [수정] 오류 알림 박스 (오류 코드 삭제) ★ --- */}
      <div className="error-alert-box">
        <span className="icon">⚠️</span>
        <div>
          <strong>카드사에서 결제를 승인하지 않았습니다.</strong>
          {/* 오류 코드 span이 삭제되었습니다. */}
        </div>
      </div>

      {/* --- 해결 방법 박스 --- */}
      <div className="result-box solution-box">
        <h2>해결 방법</h2>
        <ul className="solution-list">
          <li className="solution-item">
            <span className="number">1</span>
            <span>카드 한도를 확인해주세요</span>
          </li>
          <li className="solution-item">
            <span className="number">2</span>
            <span>카드 정보가 정확한지 확인해주세요</span>
          </li>
          <li className="solution-item">
            <span className="number">3</span>
            <span>다른 결제 수단을 사용해보세요</span>
          </li>
          <li className="solution-item">
            <span className="number">4</span>
            <span>카드사에 문의하여 거부 사유를 확인해주세요</span>
          </li>
        </ul>
      </div>

      {/* --- 고객센터 박스 --- */}
      <div className="support-box">
        <span className="icon">📞</span>
        <div>
          <h3>도움이 필요하신가요?</h3>
          <p>
            문제가 계속되거나 도움이 필요하시면 고객센터로 연락주세요.<br />
            고객센터: <strong>1588-1234</strong> (평일 09:00 - 18:00)<br />
            이메일: <strong>support@coco.com</strong>
          </p>
        </div>
      </div>

      {/* --- 알림 박스 --- */}
      <div className="notification-box" style={{ marginTop: '20px' }}>
        <p>
          <strong>알림:</strong> 결제가 실패했지만 장바구니는 그대로 유지됩니다.
          중복 결제가 우려되시면 카드사에 결제 내역을 확인하시기 바랍니다.
        </p>
      </div>

      <div className="result-buttons">
        {/* (버튼 스타일은 CSS에서 검은색으로 수정됨) */}
        <Link to="/payment" className="btn-primary-blue">다시 시도하기</Link>
        
        {/* --- ★ 4. [수정] emoji 및 'icon' 클래스 삭제 ★ --- */}
        <Link to="/cart" className="btn-secondary-light">
          장바구니로 돌아가기
        </Link>
      </div>

    </div>
  );
}

export default OrderFailPage;