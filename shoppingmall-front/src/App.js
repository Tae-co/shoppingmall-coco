import './App.css';
import Review from './pages/Review.js';
import UpdateReview from './pages/UpdateReview.js';
import {Routes, Route } from 'react-router-dom';

function App() {
  return (

    <Routes>
      <Route path="/reviews" element={<Review />} />
      <Route path="/update-reviews/:reviewNo" element={<UpdateReview />} />
    </Routes>

  );
}

export default App;
