import React from 'react';
import styled from 'styled-components';
import ProductButton from '../ProductButton';

// 스타일
const InfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ProductName = styled.h2`
  font-size: 28px;
  font-weight: bold;
`;

const ProductRating = styled.p`
  font-size: 16px;
  color: #555;
`;

// 시각적으로만 라벨을 숨기는 스타일
const VisuallyHiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const ProductPrice = styled.p`
  font-size: 24px;
  font-weight: bold;
  border-top: 1px solid #eee;
  padding-top: 16px;
`;

// 폼 공통 스타일
const CommonFormStyle = `
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const SelectBox = styled.select`
  ${CommonFormStyle}
`;

const QuantityInput = styled.input`
  ${CommonFormStyle}
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ProductInfoBox = ({
  product,
  selectedOption,
  setSelectedOption,
  quantity,
  setQuantity,
  handleAddToCart,
  handleBuyNow
}) => {
  return (
    <InfoBox>
      <ProductName>{product.prdName}</ProductName>
      <ProductRating>⭐ {product.averageRating} ({product.reviewCount})</ProductRating>
      <ProductPrice>{product.prdPrice.toLocaleString()}원</ProductPrice>
      
      {/* --- 옵션 선택 --- */}
      {product.options && product.options.length > 0 && (
        <div>
        <VisuallyHiddenLabel htmlFor="product-option">상품 옵션 선택</VisuallyHiddenLabel>
        <SelectBox 
          id="product-option"
          value={selectedOption} 
          onChange={(e) => setSelectedOption(e.target.value)}>
          <option value="">옵션을 선택하세요</option>
          {product.options.map((opt) => (
            <option key={opt.optionNo} value={opt.optionNo}>
              {opt.optionValue} 
              {opt.addPrice > 0 ? ` (+${opt.addPrice.toLocaleString()}원)` : ''} 
              (재고: {opt.stock})
            </option>
          ))}
        </SelectBox>
      </div>
      )}

      {/* --- 수량 --- */}
      <div> 
        <VisuallyHiddenLabel htmlFor="product-quantity">상품 수량</VisuallyHiddenLabel>
        <QuantityInput 
          id="product-quantity"
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          min="1"
        />
      </div>
    
      <ButtonGroup>
        <ProductButton onClick={handleAddToCart}>
          장바구니
        </ProductButton>
        <ProductButton primary onClick={handleBuyNow}>
          바로구매
        </ProductButton>
      </ButtonGroup>
    </InfoBox>
  );
};

export default ProductInfoBox;
