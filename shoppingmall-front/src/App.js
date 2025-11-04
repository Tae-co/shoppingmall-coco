import React from 'react';
// 1. PDF(33페이지)에서 배운 Routes와 Route를 import 합니다.
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';

// 2. 우리가 만든 OrderPage.jsx 파일을 import 합니다.
import OrderPage from './pages/Orderpage/OrderPage';

// 3. App.js 안에 임시 '홈 페이지' 컴포넌트를 만듭니다.
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
      {/* --- 4. 페이지 이동 링크 (메뉴) --- */}
      <nav>
        {/* PDF(35페이지)에서 배운 Link 태그를 사용합니다. */}
        <Link to="/">홈으로</Link> | <Link to="/order">주문하기</Link>
      </nav>

      {/* --- 5. 페이지가 표시될 영역 --- */}
      {/* PDF(33페이지)의 <Routes>와 <Route>로 주소를 연결합니다. */}
      <Routes>
        {/* 주소가 "/" (기본 주소)이면 HomePage를 보여줍니다. */}
        <Route path="/" element={<HomePage />} />
        
        {/* 주소가 "/order"이면 OrderPage를 보여줍니다. */}
        <Route path="/order" element={<OrderPage />} />
      </Routes>
    </div>
  );
}

export default App;