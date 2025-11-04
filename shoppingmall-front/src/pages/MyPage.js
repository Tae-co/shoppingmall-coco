import React from "react";
import "../css/MyPage.css";

function MyPage() {
  return (
    <div className="mypage-container">
      {/* 상단 헤더 영역 */}
      <div className="mypage-header">
        <h2>마이페이지</h2>
        <p>나만의 뷰티 공간</p>
      </div>

      {/* 사용자 정보 카드 */}
      <div className="mypage-user">
        <div className="user-info">
          <div className="user-avatar">뷰</div>
          <div>
            <h3>뷰티러버</h3>
            <p>beauty@coco.com</p>
          </div>
        </div>
        <div className="user-stats">
          <div>
            <strong>5,420</strong>
            <p>포인트</p>
          </div>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className="mypage-menu">
        <div className="menu-item">
          <span>👤</span>
          <div>
            <h4>프로필 설정</h4>
            <p>피부 프로필 및 회원 정보 수정</p>
          </div>
        </div>

        <div className="menu-item">
          <span>📦</span>
          <div>
            <h4>주문 내역</h4>
            <p>구매한 상품 및 배송 현황 조회</p>
          </div>
        </div>

        <div className="menu-item">
          <span>💬</span>
          <div>
            <h4>내 리뷰</h4>
            <p>작성한 리뷰 및 좋아요한 리뷰</p>
          </div>
        </div>

        <div className="menu-item">
          <span>🤝</span>
          <div>
            <h4>Co-mates</h4>
            <p>나와 비슷한 피부톤/타입 사용자들</p>
          </div>
        </div>

        <div className="menu-item">
          <span>⚙️</span>
          <div>
            <h4>계정 설정</h4>
            <p>비밀번호 변경 및 계정 관리</p>
          </div>
        </div>
      </div>

      {/* 최근 주문 */}
      <div className="mypage-orders">
        <h4>최근 주문</h4>
        <div className="order-item">
          <div>
            <p className="order-date">2024.10.18 주문번호: ORD-001</p>
            <p className="order-title">하얀루분산 인텐시브 세럼</p>
            <p className="order-price">₩45,000원</p>
          </div>
          <button className="order-status">배송중</button>
        </div>

        <div className="order-item">
          <div>
            <p className="order-date">2024.10.15 주문번호: ORD-002</p>
            <p className="order-title">바디라보 브라이트 토너 외 2건</p>
            <p className="order-price">₩98,000원</p>
          </div>
          <button className="order-status">배송중</button>
        </div>
      </div>
    </div>
  );
}

export default MyPage;