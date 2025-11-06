// src/App.js

import React from 'react';
// 라우팅 관련 기능 import: 경로 정의(Routes), 개별 경로(Route), 페이지 이동 링크(Link)
import { Routes, Route, Link } from 'react-router-dom';
import './App.css'; 

// 주문 프로세스를 구성하는 페이지 컴포넌트 import
import OrderPage from './pages/Orderpage/OrderPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage'; // 주문 성공 페이지
import OrderFailPage from './pages/OrderFailPage/OrderFailPage';       // 주문 실패 페이지

// 전역 주문 상태(Context) 관리 Provider import
import { OrderProvider } from './pages/OrderContext';

// 기본 홈 페이지 컴포넌트
function HomePage() {
  return (
    <div>
      <h1>홈 페이지</h1>
      <p>메인 페이지입니다.</p>
    </div>
  );
}

// 애플리케이션의 메인 라우팅 및 레이아웃을 정의하는 컴포넌트
function App() {
  return (
    <div className="App">
      
      {/* --- 1. 상단 네비게이션 --- */}
      <nav>
                <Link to="/">홈으로</Link> | <Link to="/order">주문하기</Link>
      </nav>

      {/* --- 2. 라우팅 및 전역 상태 관리 --- */}
      
      <OrderProvider>
        {/* URL 경로에 따라 표시할 컴포넌트를 정의하는 영역 */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* 주문 결과 페이지 경로 추가 */}
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-fail" element={<OrderFailPage />} />
        </Routes>
      </OrderProvider>
    </div>
  );
}

export default App;