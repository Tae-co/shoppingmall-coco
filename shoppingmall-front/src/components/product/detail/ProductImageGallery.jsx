import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 스타일
const ImageBox = styled.div`
  flex: 1;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border: 1px solid #eee;
  border-radius: 8px;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto;
`;

const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => (props.$active ? '#333' : '#eee')};
  transition: border-color 0.2s;

  &:hover {
    border-color: #888;
  }
`;

const ProductImageGallery = ({ productName, imageUrls }) => {
  // 이미지 상태 관리 로직
  const [selectedImage, setSelectedImage] = useState(null);

  // useEffect
  useEffect(() => {
    if (imageUrls && imageUrls.length > 0) {
      setSelectedImage(imageUrls[0]);
    }
  }, [imageUrls]); // imageUrls 배열 자체가 바뀔 때만 실행

  // 이미지가 없거나 로드 중이면 렌더링 안 함
  if (!imageUrls || imageUrls.length === 0) {
    return <ImageBox />; // (스켈레톤은 부모가 처리)
  }

  return (
    <ImageBox>
      <MainImage 
        src={selectedImage} 
        alt={productName} 
      />
      
      {/* 썸네일 목록 (이미지가 2개 이상일 때만 보임) */}
      {imageUrls.length > 1 && (
        <ThumbnailContainer>
          {imageUrls.map((imgUrl, index) => (
            <Thumbnail
              key={index}
              src={imgUrl}
              alt={`${productName} 썸네일 ${index + 1}`}
              $active={imgUrl === selectedImage}
              onClick={() => setSelectedImage(imgUrl)}
            />
          ))}
        </ThumbnailContainer>
      )}
    </ImageBox>
  );
};

export default ProductImageGallery;
