// src/pages/OrderContext.jsx

import React, { createContext, useState, useContext } from 'react';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export function OrderProvider({ children }) {
  
  // --- 1. OrderPage 폼 state ---
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  // ... (다른 폼 state는 동일) ...
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  
  // --- 2. PaymentPage 금액 state ---
  const [orderSubtotal, setOrderSubtotal] = useState(35000); // (임시) 상품 금액
  const [userPoints, setUserPoints] = useState(5000);       // (임시) 보유 포인트
  const [pointsToUse, setPointsToUse] = useState(0);        // 사용할 포인트

  // --- ★ 3. [수정] 배송비(shippingFee)를 '계산'합니다. ★ ---
  // const [shippingFee, setShippingFee] = useState(3000); (❌ 이 줄을 삭제합니다)

  const freeShippingThreshold = 30000;
  // 상품 금액(orderSubtotal)이 3만원 이상이면 0원, 아니면 3000원
  const calculatedShippingFee = orderSubtotal >= freeShippingThreshold ? 0 : 3000;
  // --- ★ 수정 끝 ★ ---


  // 'value' 객체에 state와 함수들을 담습니다.
  const value = {
    lastName, setLastName,
    firstName, setFirstName,
    phone, setPhone,
    postcode, setPostcode,
    address, setAddress,
    addressDetail, setAddressDetail,
    deliveryMessage, setDeliveryMessage,
    
    orderSubtotal, setOrderSubtotal,
    
    // ★ [수정] '고정값' 대신 '계산된 값'을 전달합니다. ★
    shippingFee: calculatedShippingFee, 
    
    userPoints, setUserPoints,
    pointsToUse, setPointsToUse
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}