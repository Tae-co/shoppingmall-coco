import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 👈 URL 파라미터(ID)를 가져오기 위한 훅

// --- 가짜 상세 데이터 (Mock Data) ---
// (DB의 productTable, productOptionTable을 합쳐놓은 형태)
const mockProductDetails = {
  '1': { 
    prdNo: 1, 
    prdName: '[JS] 히알루론산 세럼', 
    prdPrice: 45000, 
    imageUrl: 'https://picsum.photos/id/11/500/500', 
    description: '5가지 분자량의 히알루론산이 피부 깊숙이 수분을 공급하여...',
    howToUse: '세안 후 토너로 피부 결을 정돈한 뒤, 적당량을 덜어 얼굴 전체에 부드럽게 펴 바릅니다. 가볍게 두드려 흡수시켜 주세요.', // 👈 사용방법 추가
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
    imageUrl: 'https://picsum.photos/id/12/500/500',
    description: '순수 비타민C와 나이아신아마이드가 함유되어...',
    howToUse: '화장솜에 적당량을 덜어 피부 결을 따라 부드럽게 닦아내거나, 손에 덜어 가볍게 두드려 흡수시킵니다.', // 👈 사용방법 추가
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
    imageUrl: 'https://picsum.photos/id/13/500/500',
    description: '강력한 자외선 차단과 함께 피부를 진정시켜주는 데일리 선크림입니다.',
    howToUse: '기초 케어 마지막 단계에서 적당량을 덜어 자외선에 노출되기 쉬운 부위에 골고루 펴 바릅니다.', // 👈 사용방법 추가
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
      - 배송비: 기본 배송비 3,000원 (50,000원 이상 구매 시 무료배송)
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

// (간단한 스타일 객체)
const styles = {
  container: { padding: '20px', maxWidth: '1000px', margin: 'auto' },
  topSection: { display: 'flex', gap: '40px' },
  imageBox: { flex: 1 },
  productImage: { width: '100%', border: '1px solid #eee' },
  infoBox: { flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' },
  productName: { fontSize: '28px', fontWeight: 'bold' },
  productPrice: { fontSize: '24px', fontWeight: 'bold' },
  selectBox: { width: '100%', padding: '10px', fontSize: '16px' },
  quantityInput: { width: '95%', padding: '10px', fontSize: '16px' },
  button: { padding: '15px', fontSize: '16px', cursor: 'pointer' },
  tabContainer: { marginTop: '40px', borderTop: '2px solid #333' },
  tabButtons: { display: 'flex' },
  tabButton: { flex: 1, padding: '15px', border: '1px solid #ddd', background: '#f9f9f9', cursor: 'pointer', fontSize: '16px' },
  tabContent: { padding: '20px', minHeight: '200px', border: '1px solid #ddd', borderTop: 'none', lineHeight: 1.7 }
};

function ProductDetailPage() {
  // URL의 파라미터(productId) 가져오기 (예: /products/1 -> '1'을 가져옴)
  const { productId } = useParams(); 

  // 상태(State) 정의
  const [product, setProduct] = useState(null); // 불러온 상품 정보
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(''); // 선택한 옵션
  const [quantity, setQuantity] = useState(1); // 수량
  
  // 탭 상태 ('details'가 기본)
  const [currentTab, setCurrentTab] = useState('details');

  // productId가 바뀔 때마다 실행 (데이터 로드)
  useEffect(() => {
    setIsLoading(true);
    // API 호출 시뮬레이션 (0.5초 지연)
    setTimeout(() => {
      // mock 데이터에서 productId에 해당하는 상품을 찾음
      const foundProduct = mockProductDetails[productId]; 
      setProduct(foundProduct);
      setIsLoading(false);

      // 옵션이 하나뿐이면 자동으로 선택
      if (foundProduct && foundProduct.options.length === 1) {
        setSelectedOption(foundProduct.options[0].optionNo);
      } else {
        setSelectedOption(''); // 옵션이 여러 개거나 없으면 초기화
      }
    }, 500); // 0.5초
  }, [productId]); // 'productId'가 변경될 때마다 이 effect가 다시 실행됨

  // 버튼 핸들러 (지금은 기능 없음)
  const handleAddToCart = () => {
    if (!selectedOption && product.options.length > 0) {
      alert('옵션을 선택하세요.');
      return;
    }
    console.log(`[장바구니 담당] ${product.prdName}, 옵션: ${selectedOption}, 수량: ${quantity} 추가`);
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
    return <div style={styles.container}><h2>상품 정보를 불러오는 중...</h2></div>;
  }

  if (!product) {
    return <div style={styles.container}><h2>존재하지 않는 상품입니다.</h2></div>;
  }

  // 상품 정보 렌더링
  return (
    <div style={styles.container}>
      {/* --- 상단 (이미지 + 정보) --- */}
      <div style={styles.topSection}>
        {/* 왼쪽: 이미지 */}
        <div style={styles.imageBox}>
          <img src={product.imageUrl} alt={product.prdName} style={styles.productImage} />
        </div>

        {/* 오른쪽: 정보 및 구매 */}
        <div style={styles.infoBox}>
          <h2 style={styles.productName}>{product.prdName}</h2>
          <p style={styles.productPrice}>{product.prdPrice.toLocaleString()}원</p>
          <p>⭐ {product.averageRating} ({product.reviewCount})</p>
          
          {/* --- 옵션 선택 (DB: productOptionTable) --- */}
          {product.options.length > 0 && (
            <select 
              value={selectedOption} 
              onChange={(e) => setSelectedOption(e.target.value)} 
              style={styles.selectBox}
            >
              <option value="">옵션을 선택하세요</option>
              {product.options.map((opt) => (
                <option key={opt.optionNo} value={opt.optionNo}>
                  {opt.optionValue} 
                  {opt.addPrice > 0 ? ` (+${opt.addPrice.toLocaleString()}원)` : ''} 
                  (재고: {opt.stock})
                </option>
              ))}
            </select>
          )}

          {/* --- 수량 --- */}
          {(selectedOption || product.options.length === 0) && (
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} // 1 미만 방지
              min="1"
              style={styles.quantityInput} 
            />
          )}

          {/* --- 버튼 --- */}
          <button style={styles.button} onClick={handleAddToCart}>장바구니</button>
          <button style={{...styles.button, background: '#333', color: 'white'}} onClick={handleBuyNow}>바로구매</button>
        </div>
      </div>

      {/* --- 하단 (상세정보, 리뷰 탭) --- */}
      <div style={styles.tabContainer}>
        <div style={styles.tabButtons}>
          <button style={{...styles.tabButton, background: currentTab === 'details' ? 'white' : '#f9f9f9'}} onClick={() => setCurrentTab('details')}>
            상세정보
          </button>
          <button style={{...styles.tabButton, background: currentTab === 'reviews' ? 'white' : '#f9f9f9'}} onClick={() => setCurrentTab('reviews')}>
            리뷰 ({product.reviewCount})
          </button>
          <button style={{...styles.tabButton, background: currentTab === 'howToUse' ? 'white' : '#f9f9f9'}} onClick={() => setCurrentTab('howToUse')}>
            사용방법
          </button>
          <button style={{...styles.tabButton, background: currentTab === 'shipping' ? 'white' : '#f9f9f9'}} onClick={() => setCurrentTab('shipping')}>
            배송/교환
          </button>
        </div>

        {/* 탭 컨텐츠 렌더링 */}
        <div style={styles.tabContent}>
          {currentTab === 'details' && (
            <div>
              <h3>상품 상세정보</h3>
              <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
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
          {/* '사용방법' 탭 컨텐츠 추가 */}
          {currentTab === 'howToUse' && (
            <div>
              <h3>사용방법</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>
                {product.howToUse}
              </p>
            </div>
          )}
          {/* '배송/교환' 탭 컨텐츠 추가 (고정값) */}
          {currentTab === 'shipping' && (
            <div>
              {shippingInfo}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;