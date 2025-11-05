// src/App.js

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import OrderPage from './pages/Orderpage/OrderPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import { OrderProvider } from './pages/OrderContext';

// --- ★ 1. [추가] 성공/실패 페이지 import ★ ---
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage';
import OrderFailPage from './pages/OrderFailPage/OrderFailPage';

function HomePage() {
  return (
    <div>
      <h1>홈 페이지</h1>
      <p>메인 페이지입니다.</p>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <nav>
        <Link to="/">홈으로</Link> | <Link to="/order">주문하기</Link>
      </nav>

      {/* '보관함'이 페이지들을 감싸도록 합니다. */}
      <OrderProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* --- ★ 2. [추가] 성공/실패 경로 2줄 추가 ★ --- */}
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/order-fail" element={<OrderFailPage />} />
          
        </Routes>
      </OrderProvider>

    </div>
  );
}

export default App;