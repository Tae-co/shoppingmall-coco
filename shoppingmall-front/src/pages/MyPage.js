import React from "react";
import "../css/MyPage.css";
import { useNavigate } from "react-router-dom";

function MyPage() {
  const navigate = useNavigate();

  // 메뉴 데이터
  const menuItems = [
    { icon: "👤", title: "프로필 설정", desc: "피부 프로필 및 회원 정보 수정", path: "/profile-edit" },
    { icon: "📦", title: "주문 내역", desc: "구매한 상품 및 배송 현황 조회", path: "/order-history" }, 
    { icon: "💬", title: "내 리뷰", desc: "작성한 리뷰 및 좋아요한 리뷰", path: "/my-activity"},
    { icon: "🤝", title: "Co-mates", desc: "나와 비슷한 피부톤/타입 사용자들", path: "/my-comate" },
    { icon: "⚙️", title: "계정 설정", desc: "비밀번호 변경 및 계정 관리", path: "/account-settings" },
  ];

  // 주문 데이터 (상태별 색상 적용)
  const orders = [
    {
      id: "ORD-001",
      date: "2024.10.18",
      title: "히알루론산 인텐시브 세럼",
      price: "₩45,000원",
      status: "배송중",
    },
    {
      id: "ORD-002",
      date: "2024.10.15",
      title: "비타민C 브라이트닝 토너 외 2건",
      price: "₩98,000원",
      status: "배송완료",
    },
  ];

  return (
    <div className="mypage-container">
      {/* 상단 헤더 */}
      <div className="mypage-header">
        <h2>마이페이지</h2>
        <p>나만의 뷰티 공간</p>
      </div>

      {/* 사용자 정보 */}
      <div className="mypage-user">
        <div className="user-info">
          <div className="user-avatar">뷰</div>
          <div>
            <h3>뷰티러버</h3>
            <p>beauty@coco.com</p>
          </div>
        </div>
        <div className="user-stats">
          <strong>5,420</strong>
          <p>포인트</p>
        </div>
      </div>

      {/* 메뉴 섹션 */}
      <div className="mypage-menu">
        {menuItems.map((item) => (
          <div
            className="menu-item"
            key={item.title}
            onClick={() => item.path && navigate(item.path)} 
          >
            <span className="menu-icon">{item.icon}</span>
            <div className="menu-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
            <span className="menu-arrow">›</span>
          </div>
        ))}
      </div>

      {/* 최근 주문 */}
      <div className="mypage-orders">
        <h4>최근 주문</h4>

        {orders.length > 0 ? (
          orders.map((order) => (
            <div className="order-item" key={order.id}>
              <div>
                <p className="order-date">
                  {order.date} 주문번호: {order.id}
                </p>
                <p className="order-title">{order.title}</p>
                <p className="order-price">{order.price}</p>
              </div>
              <span className={`order-status ${order.status}`}>
                {order.status}
              </span>
            </div>
          ))
        ) : (
          <p className="no-orders">최근 주문이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default MyPage;
