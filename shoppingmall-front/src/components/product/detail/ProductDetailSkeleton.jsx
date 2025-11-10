import React from 'react';
import styled, { keyframes } from 'styled-components';

// 스켈레톤 애니메이션
const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
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

const SkeletonImage = styled(SkeletonBase)`
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1 / 1;
  border-radius: 8px;
`;

const SkeletonText = styled(SkeletonBase)`
  height: ${props => props.height || '20px'};
  width: ${props => props.width || '100%'};
  margin-bottom: 10px;
`;

// 스켈레톤 레이아웃 스타일
const TopSection = styled.div`
  display: flex;
  gap: 40px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageBox = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InfoBox = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

// 스켈레톤 렌더링 컴포넌트
const ProductDetailSkeleton = () => (
  <TopSection>
    <ImageBox>
      <SkeletonImage />
    </ImageBox>
    <InfoBox>
      <SkeletonText height="30px" width="70%" />
      <SkeletonText height="20px" width="30%" />
      <SkeletonText height="24px" width="40%" style={{ marginTop: '20px' }} />
      <SkeletonText height="45px" width="100%" style={{ marginTop: '20px' }} />
      <SkeletonText height="45px" width="100%" />
      <ButtonGroup>
        <SkeletonBase style={{ flex: 1, height: '50px' }} />
        <SkeletonBase style={{ flex: 1, height: '50px' }} />
      </ButtonGroup>
    </InfoBox>
  </TopSection>
);

export default ProductDetailSkeleton;
