import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import SignupTerms from './pages/SignupTerms';
import SignupInfo from './pages/SignupInfo';
import FindAccount from './pages/FindAccount';
import MyPage from './pages/MyPage';

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
      </Routes>
      {!hideHeaderFooter && <Footer />}
    </div>
  );
}

export default App;
