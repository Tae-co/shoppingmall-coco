import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import ProductButton from '../ProductButton';

// 스타일 컴포넌트
const CardLink = styled(Link)`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  text-decoration: none;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 4px;
`;

const CardContent = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* 카드의 남은 공간을 꽉 채움 */
`;

const ProductName = styled.h3`
  font-size: 17px;
  font-weight: 600;
  margin-top: 10px;
`;

const ProductRating = styled.p`
  font-size: 14px;
  color: #666;
  margin-top: 8px;
`;

// 피부 타입 태그
const TagContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 10px;
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 500;
  background: #f0f0f0;
  color: #555;
  padding: 4px 8px;
  border-radius: 4px;
`;

// 간단 리뷰
const SimpleReview = styled.p`
  font-size: 13px;
  color: #555;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f5f5f5;
  font-style: italic;

  /* --- 말줄임표 스타일 --- */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 텍스트를 2줄로 제한 */
  -webkit-box-orient: vertical;
`;

const ProductPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-top: 10px;
  
  /* lex-grow: 1과 함께 사용되어 가격을 맨 아래로 밀어냄 */
  margin-top: auto; 
  padding-top: 10px; /* 리뷰와의 간격 */
`;

const skinConcernMap = {
  hydration: '수분',
  moisture: '보습',
  brightening: '미백',
  tone: '피부톤',
  soothing: '진정',
  sensitive: '민감',
  uv: '자외선차단',
  wrinkle: '주름',
  elasticity: '탄력',
  pores: '모공'
};

const skinTypeMap = {
  dry: '건성',
  oily: '지성',
  combination: '복합성',
  sensitive: '민감성'
};

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <CardLink key={product.prdNo} to={`/products/${product.prdNo}`}>
      <ProductImage src={product.imageUrl} alt={product.prdName} loading="lazy" />
      <CardContent>
        <ProductName>{product.prdName}</ProductName>
        <ProductRating>
          ⭐ {product.averageRating} ({product.reviewCount})
        </ProductRating>
        <TagContainer>
          {/* SkinType 태그 */}
          {product.skinTypes?.map(type => (
            <Tag key={type}># {skinTypeMap[type] || type}</Tag>
          ))}
          {/* SkinConcern 태그 */}
          {product.skinConcerns?.map(concern => (
            <Tag key={concern}># {skinConcernMap[concern] || concern}</Tag>
          ))}
        </TagContainer>
        <ProductPrice>{product.prdPrice.toLocaleString()}원</ProductPrice>
        <SimpleReview>{product.simpleReview}</SimpleReview>
        <ProductButton onClick={onAddToCart} $primary style={{ marginTop: '12px' }}>
          장바구니 담기
        </ProductButton>
      </CardContent>
    </CardLink>
  );
};

export default ProductCard;
