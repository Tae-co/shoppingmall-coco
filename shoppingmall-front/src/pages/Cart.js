import React, { useState } from "react";
import "../css/Cart.css";
import OrderSteps from "../components/OrderSteps.js";

function Cart() {

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      brand: "글로우 뷰티",
      name: "히알루론산 수분 세럼",
      price: 45000,
      quantity: 2,
      image: "/images/serum.jpg",
    },
    {
      id: 2,
      brand: "립 스튜디오",
      name: "매트 립스틱 컬렉션",
      price: 25000,
      quantity: 1,
      image: "/images/lipstick.jpg",
    },
    {
      id: 3,
      brand: "에이지리즈",
      name: "안티에이징 페이스 크림",
      price: 72000,
      quantity: 1,
      image: "/images/cream.jpg",
    },
  ]);

  

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("장바구니가 비어 있습니다.");
      return;
    }
    /*navigate("/order", { state: { items: cartItems } });*/
  };

  return (
  <div className="order-page">
    <h2 className="order-title">주문하기</h2>

    <div className="order-content-area">
      <OrderSteps currentStep={1} />

      <div className="cart-grid">
        {/* 장바구니 목록 */}
       <div className="cart-list">
  <h3 className="section-title">장바구니 ({cartItems.length})</h3>

  {cartItems.length === 0 ? (
    <p className="empty-cart">장바구니가 비어 있습니다.</p>
  ) : (
    cartItems.map((item) => (
      <div key={item.id} className="cart-card">
        <img src={item.image} alt={item.name} className="cart-image" />
        <div className="cart-info">
          <p className="brand">{item.brand}</p>
          <p className="product-name">{item.name}</p>
          <p className="price">{item.price.toLocaleString()}원</p>
          <div className="quantity-box">
            <button onClick={() => decreaseQuantity(item.id)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => increaseQuantity(item.id)}>+</button>
          </div>
        </div>
        <div className="cart-summary-item">
          <p className="subtotal">
            소계: {(item.price * item.quantity).toLocaleString()}원
          </p>
          <button className="remove-btn" onClick={() => removeItem(item.id)}>
            🗑
          </button>
        </div>
      </div>
    ))
  )}
</div>

        {/* 주문 요약 */}
        <div className="order-summary">
          <h3>주문 요약</h3>
          <div className="summary-row">
            <span>상품 금액</span>
            <span>{totalPrice.toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>배송비</span>
            <span>무료</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>총 결제 금액</span>
            <strong>{totalPrice.toLocaleString()}원</strong>
          </div>
          <button className="checkout-btn">주문하기</button>
          <p className="summary-note">
            * 주문 전 재고 확인이 필요할 수 있습니다.<br />
            * 배송은 영업일 기준 2~3일 소요됩니다.
          </p>
        </div>
      </div>
    </div>
  </div>
);
/*test*/
}
export default Cart;