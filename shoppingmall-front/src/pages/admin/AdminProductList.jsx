import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- 가짜 데이터 (Mock Data) ---
// ProductListPage의 데이터를 재활용하되, 관리자용 정보를 추가합니다.
const mockAdminProducts = [
  { 
    prdNo: 1, 
    prdName: '히알루론산 수분 세럼', 
    prdPrice: 35000, 
    imageUrl: 'https://picsum.photos/id/75/100/100', 
    categoryName: '스킨케어',
    stock: 150, // 재고
    status: '판매중' // 상태
  },
  { 
    prdNo: 2, 
    prdName: '쿠션 파운데이션 23호', 
    prdPrice: 28000, 
    imageUrl: 'https://picsum.photos/id/102/100/100', 
    categoryName: '메이크업',
    stock: 80,
    status: '판매중'
  },
  { 
    prdNo: 3, 
    prdName: '딥 클렌징 오일', 
    prdPrice: 24000, 
    imageUrl: 'https://picsum.photos/id/103/100/100', 
    categoryName: '클렌징',
    stock: 65,
    status: '판매중'
  },
    { 
    prdNo: 4, 
    prdName: '비타민C 브라이트닝 크림', 
    prdPrice: 42000, 
    imageUrl: 'https://picsum.photos/id/104/100/100', 
    categoryName: '스킨케어',
    stock: 0, // 재고 0
    status: '품절' // 상태
  },
];
// ---------------------------------

// 카테고리 필터 목록 정의 (mockAdminProducts의 categoryName과 일치해야 함)
const categories = [
  '스킨케어', 
  '메이크업', 
  '클렌징', 
  '선케어'
];

// 상태 필터 목록 정의
const statuses = ['판매중', '품절'];

// (간단한 스타일 객체)
const styles = {
  container: { padding: '20px', background: '#f4f7f6' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { fontSize: '24px', fontWeight: 'bold' },
  headerButtons: { display: 'flex', gap: '10px' },
  button: { padding: '10px 15px', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  buttonPrimary: { background: '#333', color: 'white', textDecoration: 'none' },
  
  // 대시보드 (간단하게)
  dashboard: { display: 'flex', gap: '20px', marginBottom: '20px' },
  dashCard: { flex: 1, background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  
  // 상품 목록
  content: { background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  contentHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  contentTitle: { fontSize: '18px', fontWeight: 'bold' },
  
  // 테이블
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '12px', borderBottom: '2px solid #eee', background: '#f9f9f9' },
  td: { padding: '12px', borderBottom: '1px solid #eee', verticalAlign: 'middle' },
  img: { width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' },
  statusTag: { padding: '4px 8px', borderRadius: '12px', color: 'white', fontSize: '12px' },
  editButton: { textDecoration: 'none', color: 'blue', marginRight: '10px' },
  deleteButton: { color: 'red', cursor: 'pointer', background: 'none', border: 'none' },

  // 테이블 하단 텍스트 스타일 추가
  tableFooter: {
    textAlign: 'center',
    padding: '20px 0',
    color: '#555',
    fontSize: '14px',
    borderTop: '1px solid #eee'
  }
};

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 검색어(searchTerm) 상태
  const [searchTerm, setSearchTerm] = useState('');

  // selectedCategory (기본값 ''은 '전체 카테고리')
  const [selectedCategory, setSelectedCategory] = useState('');

  // selectedStatus (기본값 ''은 '전체 상태')
  const [selectedStatus, setSelectedStatus] = useState('');

  // 데이터 로드
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setProducts(mockAdminProducts);
      setIsLoading(false);
    }, 500); // 0.5초
  }, []);

  // 삭제 버튼 핸들러
  const handleDelete = (product) => {
    // 와이어프레임처럼 모달(confirm)을 팝업
    if (window.confirm(`상품을 삭제하시겠습니까?\n\n${product.prdName}\n\n이 작업은 취소할 수 없습니다.`)) {
      // (실제로는 여기서 API로 삭제 요청)
      console.log(`[관리자] ${product.prdName} (ID: ${product.prdNo}) 삭제 실행`);
      // (가짜 데이터에서 해당 상품 제거)
      setProducts(prevProducts => prevProducts.filter(p => p.prdNo !== product.prdNo));
    }
  };

  // 렌더링 직전에 (검색어 + 카테고리)로 상품 목록을 필터링
  const filteredProducts = products
    .filter(product => {
      // 검색어 필터 (상품명)
      return product.prdName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(product => {
      // 카테고리 필터
      return selectedCategory === '' || product.categoryName === selectedCategory;
      })
      .filter(product => {
      // 상태 필터
      return selectedStatus === '' || product.status === selectedStatus;
    });

  // 대시보드 데이터 계산 (필터링 전 'products' 원본 배열 사용)
  const dashboardData = {
    totalProducts: products.length,
    // '판매중'인 상품의 개수
    inStockProducts: products.filter(p => p.status === '판매중').length,
    // '품절'인 상품의 개수
    outOfStockProducts: products.filter(p => p.status === '품절').length,
    // 모든 상품의 재고 합계
    totalStockCount: products.reduce((sum, p) => sum + p.stock, 0)
  };

  if (isLoading) {
    return <div style={styles.container}><h2>관리자 페이지 로딩 중...</h2></div>;
  }

  return (
    <div style={styles.container}>
      {/* --- 1. 헤더 --- */}
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Coco 관리자 페이지</h2>
          <p>상품 관리 시스템</p>
        </div>
        <div>
          {/* (와이어프레임의 헤더 메뉴 - 지금은 링크만) */}
          <span style={{ marginRight: '15px' }}>admin님</span>
          <a href="#" style={{ marginRight: '15px' }}>대시보드</a>
          <a href="#">로그아웃</a>
        </div>
      </header>

      {/* --- 2. 대시보드 (하드코딩된 숫자를 'dashboardData'로 교체) --- */}
      <div style={styles.dashboard}>
        <div style={styles.dashCard}>
          <h3>전체 상품</h3>
          <p style={{fontSize: '24px'}}>{dashboardData.totalProducts}</p>
        </div>
        <div style={styles.dashCard}>
          <h3>판매중</h3>
          <p style={{fontSize: '24px'}}>{dashboardData.inStockProducts}</p>
        </div>
        <div style={styles.dashCard}>
          <h3>품절</h3>
          <p style={{fontSize: '24px'}}>{dashboardData.outOfStockProducts}</p>
        </div>
        <div style={styles.dashCard}>
          <h3>총 재고</h3>
          <p style={{fontSize: '24px'}}>{dashboardData.totalStockCount.toLocaleString()}</p>
        </div>
      </div>

      {/* --- 3. 상품 목록 --- */}
      <main style={styles.content}>
        <div style={styles.contentHeader}>
          <h3 style={styles.contentTitle}>상품 목록</h3>
          <div style={styles.headerButtons}>
            <button style={styles.button}>🔄 새로고침</button>
            {/* '상품 등록' 버튼 -> 상품 등록 페이지로 이동 */}
            <Link to="/admin/product/new" style={{...styles.button, ...styles.buttonPrimary}}>
              + 상품 등록
            </Link>
          </div>
        </div>

        {/* 검색 / 필터 - input에 value와 onChange 연결 */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input 
            type="text" 
            placeholder="상품명으로 검색..." 
            style={{ flex: 1, padding: '10px' }}
            value={searchTerm} // state와 연결
            onChange={(e) => setSearchTerm(e.target.value)} // state 변경
          />
          {/* 카테고리 선택 드롭다운 */}
          <select 
            style={{ padding: '10px' }}
            value={selectedCategory} // state와 연결
            onChange={(e) => setSelectedCategory(e.target.value)} // state 변경
          >
            <option value="">전체 카테고리</option>
            {/* categories 배열을 map으로 돌려서 option 태그 생성 */}
            {categories.map(categoryName => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
          
          {/* 상태 선택 드롭다운 */}
          <select 
            style={{ padding: '10px' }}
            value={selectedStatus} // state와 연결
            onChange={(e) => setSelectedStatus(e.target.value)} // state 변경
          >
            <option value="">전체 상태</option>
            {/* statuses 배열을 map으로 돌려서 option 태그 생성 */}
            {statuses.map(statusName => (
              <option key={statusName} value={statusName}>
                {statusName}
              </option>
            ))}
          </select>
        </div>

        {/* --- 4. 상품 테이블 --- */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>이미지</th>
              <th style={styles.th}>상품명</th>
              <th style={styles.th}>카테고리</th>
              <th style={styles.th}>가격</th>
              <th style={styles.th}>재고</th>
              <th style={styles.th}>상태</th>
              <th style={styles.th}>관리</th>
            </tr>
          </thead>
          <tbody>
            {/* 'products' 대신 'filteredProducts'를 map으로 렌더링 */}
            {filteredProducts.map((product) => (
              <tr key={product.prdNo}>
                <td style={styles.td}>{product.prdNo}</td>
                <td style={styles.td}><img src={product.imageUrl} alt={product.prdName} style={styles.img} /></td>
                <td style={styles.td}>{product.prdName}</td>
                <td style={styles.td}>{product.categoryName}</td>
                <td style={styles.td}>{product.prdPrice.toLocaleString()}원</td>
                <td style={styles.td}>{product.stock}개</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.statusTag, 
                    background: product.status === '판매중' ? 'green' : 'red'
                  }}>
                    {product.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <Link to={`/admin/product/edit/${product.prdNo}`} style={styles.editButton}>
                    수정
                  </Link>
                  <button onClick={() => handleDelete(product)} style={styles.deleteButton}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 테이블 바로 밑에 총 상품 개수 표시 */}
        <div style={styles.tableFooter}>
          총 {filteredProducts.length}개의 상품
        </div>

      </main>
    </div>
  );
}

export default AdminProductList;