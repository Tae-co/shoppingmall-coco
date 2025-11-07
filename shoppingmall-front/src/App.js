import React from "react"
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Login from './pages/Login';
import SignupTerms from './pages/SignupTerms';
import SignupInfo from './pages/SignupInfo';
import FindAccount from './pages/FindAccount';
import MyPage from './pages/MyPage';
import ProfileEdit from "./pages/ProfileEdit";
import OrderHistory from "./pages/OrderHistory";
import MyActivity from './pages/MyActivity';
import AccountSettings from "./pages/AccountSettings";
import MyCoMate from './pages/MyCoMate';
import OrderDetail from "./pages/OrderDetail";
import Review from './pages/Review.js';
import UpdateReview from './pages/UpdateReview.js';

function App() {
  const location = useLocation();
  const hideHeaderFooter = ['/login', '/signup/terms', '/signup/info', '/find-account'].includes(location.pathname);

  return (
    <div className="App">
      {!hideHeaderFooter && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup/terms" element={<SignupTerms />} />
        <Route path="/signup/info" element={<SignupInfo />} />
        <Route path="/find-account" element={<FindAccount />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/profile-edit" element={<ProfileEdit />} />
        <Route path="/order-history" element={<OrderHistory />} />
        <Route path="/my-activity" element={<MyActivity />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/my-comate" element={<MyCoMate />} />
        <Route path="/order-detail/:id" element={<OrderDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/reviews" element={<Review />} />
        <Route path="/update-reviews/:reviewNo" element={<UpdateReview />} />
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;