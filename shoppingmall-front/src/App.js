import React from "react"
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './pages/Cart';
import Login from './pages/Login';
import SignupTerms from './pages/SignupTerms';
import SignupInfo from './pages/SignupInfo';
import FindAccount from './pages/FindAccount';
import KakaoAdditionalInfo from './pages/KakaoAdditionalInfo';
import MyPage from './pages/MyPage';
import ProfileEdit from "./pages/ProfileEdit";
import OrderHistory from "./pages/OrderHistory";
import MyActivity from './pages/MyActivity';
import AccountSettings from "./pages/AccountSettings";
import MyCoMate from './pages/MyCoMate';
import OrderDetail from "./pages/OrderDetail";
import Review from './pages/Review.js';
import UpdateReview from './pages/UpdateReview.js';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';

function App() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/signup/terms', '/signup/info', '/find-account', '/kakao/additional-info'].includes(location.pathname);

  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/terms" element={<SignupTerms />} />
        <Route path="/signup/info" element={<SignupInfo />} />
        <Route path="/find-account" element={<FindAccount />} />
        <Route path="/kakao/additional-info" element={<KakaoAdditionalInfo />} />
        
        <Route element={<ProtectedRoute />}> //로그인이 필요한 페이지는 ProtectedRoute로 감싸서 접근 제어
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/profile-edit" element={<ProfileEdit />} />
          <Route path="/order-history" element={<OrderHistory />} />
          <Route path="/my-activity" element={<MyActivity />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/my-comate" element={<MyCoMate />} />
          <Route path="/order-detail/:id" element={<OrderDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/update-reviews/:reviewNo" element={<UpdateReview />} />
        </Route>

        <Route path="/reviews" element={<Review />} />
        <Route path="/product" element={<ProductListPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;