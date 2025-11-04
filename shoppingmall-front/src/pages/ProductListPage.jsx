import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 👈 상품 상세로 가려면 필요합니다.

// --- 가짜 데이터 (Mock Data) ---
// (원래는 API로 받아와야 할 데이터)
const mockProductListData = [
  { 
    prdNo: 1, 
    prdName: '[JS] 히알루론산 세럼', 
    prdPrice: 45000, 
    imageUrl: 'https://picsum.photos/id/11/300/300', 
    reviewCount: 3421, 
    averageRating: 4.8,
    skinTypes: ['dry', 'sensitive'], // 👈 필터용 데이터 (건성, 민감성)
    skinConcerns: ['hydration', 'soothing'] // 👈 (수분, 진정)
  },
  { 
    prdNo: 2, 
    prdName: '[JS] 비타C C 토너', 
    prdPrice: 52000, 
    imageUrl: 'https://picsum.photos/id/12/300/300', 
    reviewCount: 2166, 
    averageRating: 4.5,
    skinTypes: ['oily', 'combination'], // 👈 (지성, 복합성)
    skinConcerns: ['brightening', 'pores'] // 👈 (미백, 모공)
  },
  { 
    prdNo: 3, 
    prdName: '[JS] 선크림 SPF50+', 
    prdPrice: 25000, 
    imageUrl: 'https://picsum.photos/id/13/300/300', 
    reviewCount: 1500, 
    averageRating: 4.7,
    skinTypes: ['sensitive', 'dry'], // 👈 (민감성, 건성)
    skinConcerns: ['uv', 'soothing'] // 👈 (자외선차단, 진정)
  },
];
// ---------------------------------

// --- 필터 옵션 정의 ---
const filterOptions = {
  skinTypes: [
    { id: 'dry', label: '건성' },
    { id: 'oily', label: '지성' },
    { id: 'combination', label: '복합성' },
    { id: 'sensitive', label: '민감성' },
  ],
  skinConcerns: [
    { id: 'hydration', label: '수분/보습' },
    { id: 'brightening', label: '미백' },
    { id: 'pores', label: '모공' },
    { id: 'soothing', label: '진정' },
    { id: 'uv', label: '자외선차단' },
  ]
};
// ---------------------------------

// (CSS를 위해 간단한 스타일 객체)
const styles = {
  pageContainer: { display: 'flex', padding: '20px' },
  filterSidebar: { width: '200px', padding: '10px', borderRight: '1px solid #eee' },
  filterGroup: { marginBottom: '20px' },
  filterTitle: { fontSize: '16px', fontWeight: 'bold' },
  filterLabel: { display: 'block', margin: '5px 0' },
  mainContent: { flex: 1, paddingLeft: '20px' },
  title: { fontSize: '24px', marginBottom: '20px' },
  productList: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  productCard: { border: '1px solid #ddd', padding: '10px', textDecoration: 'none', color: 'black' },
  productImage: { width: '100%', height: 'auto' },
  productName: { fontSize: '18px', fontWeight: 'bold' },
  productPrice: { fontSize: '16px', marginTop: '5px' },
  productRating: { fontSize: '14px', color: '#666', marginTop: '5px' }
};

function ProductListPage() {
  // 상품 목록을 저장할 상태 (State)
  const [products, setProducts] = useState([]);
  // 로딩 중인지 알려줄 상태
  const [isLoading, setIsLoading] = useState(true);

  // 필터 상태 관리
  const [activeFilters, setActiveFilters] = useState({
    skinTypes: [],    // 예: ['dry', 'sensitive']
    skinConcerns: []  // 예: ['hydration']
  });

  // 전체 상품 목록은 처음에 한 번만 불러오기
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProducts(mockProductListData);
      setIsLoading(false);
    }, 1000);
  }, []);

  // 필터 변경 핸들러
  const handleFilterChange = (category, value) => {
    // category: 'skinTypes' 또는 'skinConcerns'
    // value: 'dry', 'hydration' 등
    setActiveFilters(prevFilters => {
      const currentValues = prevFilters[category]; // 현재 활성화된 필터 배열
      let newValues;

      if (currentValues.includes(value)) {
        // 이미 체크되어 있으면 -> 체크 해제 (배열에서 제거)
        newValues = currentValues.filter(item => item !== value);
      } else {
        // 체크 안되어 있으면 -> 체크 (배열에 추가)
        newValues = [...currentValues, value];
      }
      
      return { ...prevFilters, [category]: newValues };
    });
  };

  // 렌더링 직전에 필터링 로직 수행
  const filteredProducts = products.filter(product => {
    // 스킨타입 필터 검사
    const skinTypeMatch = activeFilters.skinTypes.length === 0 || // 선택된 필터가 없으면 모두 통과
      activeFilters.skinTypes.some(filterType => product.skinTypes.includes(filterType));

    // 스킨고민 필터 검사
    const skinConcernMatch = activeFilters.skinConcerns.length === 0 ||
      activeFilters.skinConcerns.some(filterConcern => product.skinConcerns.includes(filterConcern));
    
    // 두 필터를 모두 만족해야 함
    return skinTypeMatch && skinConcernMatch;
  });

  // 컴포넌트가 처음 렌더링될 때 API를 호출 (지금은 가짜 데이터 로드)
  useEffect(() => {
    // API 호출 시뮬레이션 (1초 지연)
    setIsLoading(true);
    setTimeout(() => {
      setProducts(mockProductListData); // 가짜 데이터를 state에 저장
      setIsLoading(false);
    }, 1000); // 1초 뒤에 데이터가 들어온 것처럼
  }, []); // [] (빈 배열) : 처음 한 번만 실행

  // 로딩 중일 때 표시할 화면
  if (isLoading) {
    return <div style={styles.container}><h2>상품 목록을 불러오는 중...</h2></div>;
  }

  // 로딩이 끝나고 상품을 화면에 그리기
  return (
    <div style={styles.pageContainer}>
      
      {/* --- 필터 사이드바 UI --- */}
      <aside style={styles.filterSidebar}>
        <h3>필터</h3>
        {/* 피부타입 필터 */}
        <div style={styles.filterGroup}>
          <h4 style={styles.filterTitle}>피부타입</h4>
          {filterOptions.skinTypes.map(option => (
            <label key={option.id} style={styles.filterLabel}>
              <input 
                type="checkbox" 
                checked={activeFilters.skinTypes.includes(option.id)}
                onChange={() => handleFilterChange('skinTypes', option.id)}
              />
              {option.label}
            </label>
          ))}
        </div>
        {/* 피부고민 필터 */}
        <div style={styles.filterGroup}>
          <h4 style={styles.filterTitle}>피부고민</h4>
          {filterOptions.skinConcerns.map(option => (
            <label key={option.id} style={styles.filterLabel}>
              <input 
                type="checkbox" 
                checked={activeFilters.skinConcerns.includes(option.id)}
                onChange={() => handleFilterChange('skinConcerns', option.id)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </aside>

      {/* --- 메인 상품 목록 --- */}
      <main style={styles.mainContent}>
        <h2 style={styles.title}>상품 목록 ({filteredProducts.length}개)</h2>
        
        {/* 정렬 UI가 들어갈 자리 */}
        
        <div style={styles.productList}>
          {/* 'products' 대신 'filteredProducts'를 map으로 렌더링 */}
          {filteredProducts.map((product) => (
            <Link key={product.prdNo} to={`/products/${product.prdNo}`} style={styles.productCard}>
              <img src={product.imageUrl} alt={product.prdName} style={styles.productImage} />
              <h3 style={styles.productName}>{product.prdName}</h3>
              <p style={styles.productPrice}>{product.prdPrice.toLocaleString()}원</p>
              <p style={styles.productRating}>
                ⭐ {product.averageRating} ({product.reviewCount})
              </p>
            </Link>
          ))}
        </div>
        
        {/* 페이지네이션 UI가 들어갈 자리 */}
      </main>
    </div>
  );
}

export default ProductListPage;