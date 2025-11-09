import React from 'react';
import styled, { keyframes } from 'styled-components';

// 스켈레톤 애니메이션
const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

// 스켈레톤 스타일 컴포넌트
const SkeletonBase = styled.div`
  background: #f0f0f0;
  background-image: linear-gradient(to right, #f0f0f0 0%, #e8e8e8 20%, #f0f0f0 40%, #f0f0f0 100%);
  background-repeat: no-repeat;
  background-size: 800px 100%;
  border-radius: 4px;
  animation: ${shimmer} 1.5s linear infinite;
`;

const SkeletonCard = styled.div`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
`;

const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 4px;
`;

const SkeletonContent = styled.div`
  padding: 10px;
`;

const SkeletonText = styled(SkeletonBase)`
  height: 20px;
  margin-top: 10px;
  &:first-child {
    width: 80%;
  }
  &:last-child {
    width: 50%;
  }
`;

// 스켈레톤 목록 그리드 스타일
const ProductListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
`;

const ITEMS_PER_PAGE = 6; 

const ProductListSkeleton = () => (
  <ProductListGrid>
    {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
      <SkeletonCard key={index}>
        <SkeletonImage />
        <SkeletonContent>
          <SkeletonText />
          <SkeletonText />
        </SkeletonContent>
      </SkeletonCard>
    ))}
  </ProductListGrid>
);

export default ProductListSkeleton;
