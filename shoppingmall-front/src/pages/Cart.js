import React, { useState } from "react";
import "../css/Cart.css"; // ✅ CSS 불러오기

function Cart() {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "토너", price: 15000, quantity: 1 },
    { id: 2, name: "에센스", price: 25000, quantity: 2 },
  ]);

  // 수량 증가
  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // 수량 감소
  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // 상품 삭제
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // 총합 계산
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h2>🛒 장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              {/* 상품 정보 */}
              <div className="cart-item-left">
                <h3>{item.name}</h3>
                <span className="cart-price">
                  가격: {item.price.toLocaleString()}원
                </span>
              </div>

              {/* 수량 및 삭제 버튼 */}
              <div className="cart-actions">
                <div className="quantity-control">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
                <button className="remove-btn" onClick={() => removeItem(item.id)}>
                  삭제
                </button>
              </div>
            </div>
          ))}
          <h3 className="cart-total">
            총 금액: {totalPrice.toLocaleString()}원
          </h3>
        </div>
      )}
    </div>
  );
}

export default Cart;