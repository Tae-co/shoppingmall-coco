import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

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

// --- 스타일 컴포넌트 정의 ---

// (기존 styles.container)
const Container = styled.div`
  padding: 20px;
`;

// (기존 styles.header)
const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

// 대시보드 스타일 컴포넌트
const Dashboard = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

const DashCard = styled.div`
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const DashCardTitle = styled.h3`
  font-size: 16px; /* AdminHome(h3)과 맞추기 위해 h3로 변경 */
  font-weight: 600;
  color: #555;
  margin-bottom: 10px;
`;

const DashCardValue = styled.p`
  font-size: 24px;
  font-weight: bold;
  margin: 0;
`;

// (기존 styles.content)
const Content = styled.main`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const ContentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ContentTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 10px;
`;

// (기존 styles.button)
const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  background: #f0f0f0;
  color: #333;
  transition: background 0.2s;

  &:hover {
    background: #e0e0e0;
  }
`;

// (기존 styles.buttonPrimary - Link 태그용)
const ButtonLink = styled(Link)`
  padding: 10px 15px;
  border-radius: 5px;
  font-size: 14px;
  background: #333;
  color: white;
  text-decoration: none;
  transition: background 0.2s;

  &:hover {
    background: #555;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

// <input>, <select> 태그에 공통 스타일 적용
const CommonInputStyle = `
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

const SearchInput = styled.input`
  ${CommonInputStyle}
  flex: 1; /* 검색창만 길게 */
`;

const FilterSelect = styled.select`
  ${CommonInputStyle}
`;

// 👇 1. 테이블을 감쌀 'TableWrapper' 컴포넌트 정의
const TableWrapper = styled.div`
  width: 100%; /* (Content) 영역을 꽉 채움 */
  overflow-x: auto; /* 내용물이 밖으로 넘치면 가로 스크롤바를 만듭니다 */
`;

// (기존 styles.table)
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px; /* 테이블의 최소 너비를 설정 */
`;

const Th = styled.th`
  padding: 12px;
  border-bottom: 2px solid #eee;
  background: #f9f9f9;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap; /* 셀 내용이 잘리거나 줄바꿈되지 않도록 진행 */
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
  font-size: 14px;
  white-space: nowrap;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

// (기존 styles.statusTag)
// props를 받아 '판매중'과 '품절'의 배경색을 다르게 설정
const StatusTag = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  background: ${props => (props.status === '판매중' ? 'green' : 'red')};
`;

// (기존 styles.editButton - Link 태그용)
const EditLink = styled(Link)`
  color: blue;
  text-decoration: none;
  margin-right: 10px;
  &:hover {
    text-decoration: underline;
  }
`;

// (기존 styles.deleteButton)
const DeleteButton = styled.button`
  color: red;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

// (기존 styles.tableFooter)
const TableFooter = styled.div`
  text-align: center;
  padding: 20px 0;
  color: #555;
  font-size: 14px;
  border-top: 1px solid #eee;
`;

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
    return <Container><h2>관리자 페이지 로딩 중...</h2></Container>;
  }

  return (
    <Container>
      {/* --- 1. 헤더 --- */}
      <Header>
        <div>
          <Title>상품 관리 시스템</Title>
        </div>
        <div>
          <span style={{ marginRight: '15px' }}>admin님</span>
          <EditLink to="/admin" style={{ marginRight: '15px' }}>대시보드</EditLink>
          <Button as="a" href="#">로그아웃</Button>
        </div>
      </Header>

      {/* --- 2. 대시보드 'dashboardData' --- */}
      <Dashboard>
        <DashCard>
          <DashCardTitle>전체 상품</DashCardTitle>
          <DashCardValue>{dashboardData.totalProducts}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>판매중</DashCardTitle>
          <DashCardValue>{dashboardData.inStockProducts}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>품절</DashCardTitle>
          <DashCardValue>{dashboardData.outOfStockProducts}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>총 재고</DashCardTitle>
          <DashCardValue>{dashboardData.totalStockCount.toLocaleString()}</DashCardValue>
        </DashCard>
      </Dashboard>

      {/* --- 3. 상품 목록 --- */}
      <Content>
        <ContentHeader>
          <ContentTitle>상품 목록</ContentTitle>
          <HeaderButtons>
            <Button onClick={() => window.location.reload()}>🔄 새로고침</Button>
            <ButtonLink to="/admin/product/new">
              + 상품 등록
            </ButtonLink>
          </HeaderButtons>
        </ContentHeader>

        {/* 검색 / 필터 - input에 value와 onChange 연결 */}
        <FilterContainer>
          <SearchInput 
            type="text" 
            placeholder="상품명으로 검색..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <FilterSelect 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">전체 카테고리</option>
            {categories.map(categoryName => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </FilterSelect>
          
          <FilterSelect 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">전체 상태</option>
            {statuses.map(statusName => (
              <option key={statusName} value={statusName}>
                {statusName}
              </option>
            ))}
          </FilterSelect>
        </FilterContainer>

        {/* --- 4. 상품 테이블 --- */}
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>ID</Th>
                <Th>이미지</Th>
                <Th>상품명</Th>
                <Th>카테고리</Th>
                <Th>가격</Th>
                <Th>재고</Th>
                <Th>상태</Th>
                <Th>관리</Th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.prdNo}>
                  <Td>{product.prdNo}</Td>
                  <Td><ProductImage src={product.imageUrl} alt={product.prdName} /></Td>
                  <Td>{product.prdName}</Td>
                  <Td>{product.categoryName}</Td>
                  <Td>{product.prdPrice.toLocaleString()}원</Td>
                  <Td>{product.stock}개</Td>
                  <Td>
                    {/* props로 상태값을 전달 */}
                    <StatusTag status={product.status}>
                      {product.status}
                    </StatusTag>
                  </Td>
                  <Td>
                    <EditLink to={`/admin/product/edit/${product.prdNo}`}>
                      수정
                    </EditLink>
                    <DeleteButton onClick={() => handleDelete(product)}>
                      삭제
                    </DeleteButton>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
        
        <TableFooter>
          총 {filteredProducts.length}개의 상품
        </TableFooter>

      </Content>
    </Container>
  );
}

export default AdminProductList;