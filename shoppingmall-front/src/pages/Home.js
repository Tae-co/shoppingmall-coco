import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1>안녕하세요</h1>
        <button className="login-button" onClick={handleLoginClick}>
          로그인
        </button>
      </div>
    </div>
  );
};

export default Home;

