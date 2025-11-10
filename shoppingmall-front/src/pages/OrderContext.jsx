import React, { createContext, useState, useContext } from 'react';

// Context 객체 생성
const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

// 주문 관련 상태를 전역적으로 관리하는 Provider 컴포넌트
export function OrderProvider({ children }) {
  
  // --- 1. OrderPage (배송 정보) 폼 state ---
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [postcode, setPostcode] = useState('');
  const [address, setAddress] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [deliveryMessage, setDeliveryMessage] = useState('');
  
  // --- 2. PaymentPage (금액) state ---
  const [orderSubtotal, setOrderSubtotal] = useState(1000); // (임시) 상품 금액
  const [userPoints, setUserPoints] = useState(5000);       // (임시) 보유 포인트
  const [pointsToUse, setPointsToUse] = useState(0);        // 사용할 포인트

  // --- 3. 배송비(shippingFee) 계산 로직 ---
  const freeShippingThreshold = 30000;
  // 상품 금액(orderSubtotal)이 3만원 이상이면 0원, 아니면 3000원으로 계산
  const calculatedShippingFee = orderSubtotal >= freeShippingThreshold ? 0 : 3000;

  // Context를 통해 전달할 값 객체 (모든 state와 setter, 계산된 값 포함)
  const value = {
    lastName, setLastName,
    firstName, setFirstName,
    phone, setPhone,
    postcode, setPostcode,
    address, setAddress,
    addressDetail, setAddressDetail,
    deliveryMessage, setDeliveryMessage,
    
    orderSubtotal, setOrderSubtotal,
    
    // 계산된 배송비를 'shippingFee'로 전달
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