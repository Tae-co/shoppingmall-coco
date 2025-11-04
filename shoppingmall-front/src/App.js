import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Cart from './pages/Cart';

function App() {
  return (
    <div className="App">
      <Header />
      <Cart/>
      <Footer />
    </div>
  );
}

export default App;