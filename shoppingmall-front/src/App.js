import './App.css';
import Review from './pages/Review.js';
import UpdateReview from './pages/UpdateReview.js';
import {Routes, Route } from 'react-router-dom';
// 여기서 모든 css 임포트 하기 
function App() {
  return (

    <Routes>
      <Route path="/reviews" element={<Review />} />
      <Route path="/update-reviews/:reviewNo" element={<UpdateReview />} />
    </Routes>

  );
}

export default App;
