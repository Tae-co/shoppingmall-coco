import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import ProductButton from '../components/product/ProductButton';

// --- 가짜 상세 데이터 (Mock Data) ---
// (DB의 productTable, productOptionTable을 합쳐놓은 형태)
const mockProductDetails = {
  '1': { 
    prdNo: 1, 
    prdName: '[JS] 히알루론산 세럼', 
    prdPrice: 45000, 
    imageUrls: [
      'https://picsum.photos/id/11/500/500', // 1번 (메인)
      'https://picsum.photos/id/21/500/500', // 2번 (제형)
      'https://picsum.photos/id/31/500/500'  // 3번 (사용)
    ],
    description: '5가지 분자량의 히알루론산이 피부 깊숙이 수분을 공급하여...',
    howToUse: '세안 후 토너로 피부 결을 정돈한 뒤, 적당량을 덜어 얼굴 전체에 부드럽게 펴 바릅니다. 가볍게 두드려 흡수시켜 주세요.', // 사용방법 추가
    reviewCount: 3421, 
    averageRating: 4.8,
    options: [
      { optionNo: 101, optionValue: '50ml (기본)', addPrice: 0, stock: 100 },
      { optionNo: 102, optionValue: '100ml (대용량)', addPrice: 20000, stock: 50 },
    ]
  },
  '2': { 
    prdNo: 2, 
    prdName: '[JS] 비타C C 토너', 
    prdPrice: 52000, 
    imageUrls: [
      'https://picsum.photos/id/12/500/500', // 1번 (메인)
      'https://picsum.photos/id/22/500/500'  // 2번
    ],
    description: '순수 비타민C와 나이아신아마이드가 함유되어...',
    howToUse: '화장솜에 적당량을 덜어 피부 결을 따라 부드럽게 닦아내거나, 손에 덜어 가볍게 두드려 흡수시킵니다.', // 사용방법 추가
    reviewCount: 2166, 
    averageRating: 4.5,
    options: [
      { optionNo: 201, optionValue: '200ml', addPrice: 0, stock: 80 },
    ]
  },
  '3': { 
    prdNo: 3, 
    prdName: '[JS] 선크림 SPF50+', 
    prdPrice: 25000, 
    imageUrls: [
      'https://picsum.photos/id/13/500/500'
    ],
    description: '강력한 자외선 차단과 함께 피부를 진정시켜주는 데일리 선크림입니다.',
    howToUse: '기초 케어 마지막 단계에서 적당량을 덜어 자외선에 노출되기 쉬운 부위에 골고루 펴 바릅니다.', // 사용방법 추가
    reviewCount: 1500, 
    averageRating: 4.7,
    options: []
  },
};
// ---------------------------------

// --- 배송/교환 탭에 들어갈 고정 내용 ---
const shippingInfo = (
  <div>
    <h3>배송 안내</h3>
    <p>
      - 배송비: 기본 배송비 3,000원 (30,000원 이상 구매 시 무료배송)
      <br />
      - 배송 기간: 영업일 기준 2~3일 소요됩니다. (주말/공휴일 제외)
      <br />
      - 도서/산간 지역은 별도의 추가 배송비가 발생할 수 있습니다.
    </p>
    <br />
    <h3>교환 및 반품 안내</h3>
    <p>
      - 단순 변심으로 인한 교환/반품은 상품 수령 후 7일 이내에 가능합니다. (왕복 배송비 6,000원 고객 부담)
      <br />
      - 상품 불량 또는 오배송의 경우, 수령 후 30일 이내에 교환/반품이 가능합니다. (배송비 무료)
      <br />
      - 단, 제품 포장을 개봉하였거나 상품 가치가 훼손된 경우에는 교환/반품이 불가합니다.
    </p>
  </div>
);
// ---------------------------------

// --- 스타일 컴포넌트 정의 ---

// 토스트 알림을 위한 애니메이션 정의
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
`;

const Container = styled.div`
  padding: 40px 20px;
  max-width: 1024px;
  margin: 0 auto;
`;

const BackButtonContainer = styled.div`
  width: 100%;
  text-align: left;
`;

const BackButton = styled.button`
  background: none;
  border: 1px solid #ddd;
  padding: 8px 15px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background 0.2s;

  &:hover {
    background: #f9f9f9;
  }
`;

const TopSection = styled.div`
  display: flex;
  gap: 40px;

  /* 모바일 반응형: 화면이 768px보다 좁아지면 세로로 쌓임 */
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

const MainImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border: 1px solid #eee;
  border-radius: 8px;
`;

// 썸네일 컨테이너
const ThumbnailContainer = styled.div`
  display: flex;
  gap: 10px;
  overflow-x: auto; /* 썸네일이 많아지면 가로 스크롤 */
`;

// 썸네일 이미지
const Thumbnail = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  border: 2px solid ${props => (props.$active ? '#333' : '#eee')}; /* $active로 활성 썸네일 표시 */
  transition: border-color 0.2s;

  &:hover {
    border-color: #888;
  }
`;

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

// --- 하단 탭 스타일 ---
const TabContainer = styled.div`
  margin-top: 60px;
  border-top: 2px solid #333;
`;

const TabButtons = styled.div`
  display: flex;
  border-bottom: 1px solid #eee;
`;

// $active (transient prop) 사용
const TabButton = styled.button`
  flex: 1;
  padding: 15px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  
  /* $active 값에 따라 스타일 변경 */
  border-bottom: ${props => (props.$active ? '3px solid #333' : '3px solid transparent')};
  color: ${props => (props.$active ? '#333' : '#888')};
  
  transition: border-color 0.2s, color 0.2s;

  &:hover {
    color: #333;
  }
`;

const TabContent = styled.div`
  padding: 20px;
  min-height: 200px;
  line-height: 1.7;
  font-size: 16px;
`;

// 토스트 알림 스타일 컴포넌트
const Toast = styled.div`
  position: fixed; /* 화면에 고정 */
  bottom: 30px; /* 화면 하단에 */
  left: 50%; /* 가로 중앙 정렬 */
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  font-size: 15px;
  z-index: 2000;
  
  /* $visible prop에 따라 애니메이션 적용 */
  visibility: ${props => (props.$visible ? 'visible' : 'hidden')};
  opacity: ${props => (props.$visible ? 1 : 0)};
  animation: ${props => (props.$visible ? fadeIn : fadeOut)} 0.3s ease-in-out;
  transition: visibility 0.3s, opacity 0.3s;
`;

// ---------------------------------

function ProductDetailPage() {
  // URL의 파라미터(productId) 가져오기 (예: /products/1 -> '1'을 가져옴)
  const { productId } = useParams(); 
  const [product, setProduct] = useState(null); // 불러온 상품 정보
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null); // 현재 선택된 이미지 URL을 관리할 상태
  const [selectedOption, setSelectedOption] = useState(''); // 선택한 옵션
  const [quantity, setQuantity] = useState(1); // 수량
  const [currentTab, setCurrentTab] = useState('details');  // 탭 상태 ('details'가 기본)
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [toastMessage, setToastMessage] = useState(''); // 토스트 알림 상태

  // productId가 바뀔 때마다 실행 (데이터 로드)
  useEffect(() => {
    setIsLoading(true);
    // API 호출 시뮬레이션 (0.5초 지연)
    setTimeout(() => {
      // mock 데이터에서 productId에 해당하는 상품을 찾음
      const foundProduct = mockProductDetails[productId]; 
      setProduct(foundProduct);

      if (foundProduct) {
        // 첫 번째 이미지를 기본 선택 이미지로 설정
        setSelectedImage(foundProduct.imageUrls[0]); 

        if (foundProduct.options.length === 1) {
          setSelectedOption(foundProduct.options[0].optionNo);
        } else {
          setSelectedOption('');
        }
      }
      setIsLoading(false);
    }, 500);
  }, [productId]); // 'productId'가 변경될 때마다 이 effect가 다시 실행됨

  // 토스트 메시지가 나타나면 2초 후에 사라지도록 하는 useEffect
  useEffect(() => {
    if (toastMessage) {
      // 메시지가 있으면 2초(2000ms) 타이머 설정
      const timer = setTimeout(() => {
        setToastMessage(''); // 2초 후 메시지 지우기
      }, 2000);

      // 컴포넌트가 언마운트되거나 메시지가 바뀌면 타이머 정리
      return () => clearTimeout(timer);
    }
  }, [toastMessage]); // toastMessage가 변경될 때마다 이 훅이 실행됨

  // 뒤로가기 버튼 클릭 핸들러
  const handleBack = () => {
    navigate(-1); // 브라우저의 '뒤로가기'와 동일하게 동작
  };

  // 버튼 핸들러 (지금은 기능 없음)
  const handleAddToCart = () => {
    if (!selectedOption && product.options.length > 0) {
      alert('옵션을 선택하세요.');
      return;
    }
    // (토스트 메시지 설정)
    setToastMessage('장바구니에 상품을 담았습니다.');

    // (나중에 장바구니 로직 추가...)
  };

  const handleBuyNow = () => {
    if (!selectedOption && product.options.length > 0) {
      alert('옵션을 선택하세요.');
      return;
    }
    console.log(`[주문 담당] ${product.prdName}, 옵션: ${selectedOption}, 수량: ${quantity} 바로구매`);
  };

  // 로딩 중 또는 상품이 없을 때
 if (isLoading) {
    return <Container><h2>상품 정보를 불러오는 중...</h2></Container>;
  }
  if (!product) {
    return <Container><h2>존재하지 않는 상품입니다.</h2></Container>;
  }

  // 상품 정보 렌더링
 return (
    <Container>
      {/* 토스트 컴포넌트 렌더링 */}
      <Toast $visible={!!toastMessage}>
        {toastMessage}
      </Toast>

      <BackButtonContainer>
        <BackButton onClick={handleBack}>
          &lt; 뒤로가기
        </BackButton>
      </BackButtonContainer>

      <TopSection>
        <ImageBox>
          <MainImage src={selectedImage} alt={product.prdName} />

          {/* 썸네일 목록 (이미지가 2개 이상일 때만 보임) */}
          {product.imageUrls.length > 1 && (
            <ThumbnailContainer>
              {product.imageUrls.map((imgUrl, index) => (
                <Thumbnail
                  key={index}
                  src={imgUrl}
                  alt={`${product.prdName} 썸네일 ${index + 1}`}
                  $active={imgUrl === selectedImage}
                  // 클릭하면 selectedImage 상태를 변경
                  onClick={() => setSelectedImage(imgUrl)}
                />
              ))}
            </ThumbnailContainer>
          )}
        </ImageBox>

        <InfoBox>
          <ProductName>{product.prdName}</ProductName>
          <ProductRating>⭐ {product.averageRating} ({product.reviewCount})</ProductRating>
          <ProductPrice>{product.prdPrice.toLocaleString()}원</ProductPrice>
          
          {/* --- 옵션 선택 --- */}
          {product.options.length > 0 && (
            <div>
            {/* 스크린 리더용 라벨 */}
            <VisuallyHiddenLabel htmlFor="product-option">
              상품 옵션 선택
            </VisuallyHiddenLabel>
            <SelectBox 
              id="product-option" /* id 속성 */
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
        {(selectedOption || product.options.length === 0) && (
          <div> 
            {/* 스크린 리더용 라벨 */}
            <VisuallyHiddenLabel htmlFor="product-quantity">
              상품 수량
            </VisuallyHiddenLabel>
            <QuantityInput 
              id="product-quantity" /* id 속성 */
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              min="1"
            />
          </div>
        )}

          <ButtonGroup>
            {/* '장바구니' */}
            <ProductButton onClick={handleAddToCart}>
              장바구니
            </ProductButton>
            {/* '바로구매' */}
            <ProductButton primary onClick={handleBuyNow}>
              바로구매
            </ProductButton>
          </ButtonGroup>
        </InfoBox>
      </TopSection>

      <TabContainer>
        <TabButtons>
          {/* $active (transient prop) 사용 */}
          <TabButton 
            $active={currentTab === 'details'} 
            onClick={() => setCurrentTab('details')}
          >
            상세정보
          </TabButton>
          <TabButton 
            $active={currentTab === 'reviews'} 
            onClick={() => setCurrentTab('reviews')}
          >
            리뷰 ({product.reviewCount})
          </TabButton>
          <TabButton 
            $active={currentTab === 'howToUse'} 
            onClick={() => setCurrentTab('howToUse')}
          >
            사용방법
          </TabButton>
          <TabButton 
            $active={currentTab === 'shipping'} 
            onClick={() => setCurrentTab('shipping')}
          >
            배송/교환
          </TabButton>
        </TabButtons>
        
        <TabContent>
          {currentTab === 'details' && (
            <div>
              <h3>상품 상세정보</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {product.description}
              </p>
            </div>
          )}
          {currentTab === 'reviews' && (
            <div>
              <h3>상품 리뷰</h3>
              <p>[리뷰 담당] 리뷰 컴포넌트가 연동될 영역입니다.</p>
            </div>
          )}
          {currentTab === 'howToUse' && (
            <div>
              <h3>사용방법</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {product.howToUse}
              </p>
            </div>
          )}
          {currentTab === 'shipping' && (
            <div>
              {shippingInfo}
            </div>
          )}
        </TabContent>
      </TabContainer>
    </Container>
  );
}

export default ProductDetailPage;