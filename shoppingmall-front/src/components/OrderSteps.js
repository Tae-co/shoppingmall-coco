import React from "react";
import "../css/OrderSteps.css";

function OrderSteps({ currentStep = 1 }) {
  const steps = [
    { id: 1, title: "장바구니", desc: "상품 확인" },
    { id: 2, title: "배송 정보", desc: "배송지 입력" },
    { id: 3, title: "결제", desc: "결제 수단 선택" },
    { id: 4, title: "주문 완료", desc: "주문 확인" },
  ];

  return (
    <div className="order-steps">
      {steps.map((step, index) => (
        <div key={step.id} className="step">
          {/* 원형 단계 표시 */}
          <div
            className={`circle ${currentStep === step.id ? "active" : ""}`}
          >
            {step.id}
          </div>

          {/* 텍스트 */}
          <div className="step-text">
            <div className="step-title">{step.title}</div>
            <div className="step-desc">{step.desc}</div>
          </div>

          {/* 단계 사이의 선 */}
          {index < steps.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
}

export default OrderSteps;