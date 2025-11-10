import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAdminProducts, deleteAdminProduct } from '../../api/mockApi';

import {
  Input, Select,
  Dashboard,
  DashCard,
  DashCardTitle,
  DashCardValue,
  ContentHeader,
  ContentTitle,
  Card,
  ButtonLink, // + 상품 등록 버튼
  Button,     // 새로고침 버튼
  TableWrapper, Table, Th, Td // 테이블 관련
} from '../../styles/admincommon';

const categories = [
  '스킨케어', 
  '메이크업', 
  '클렌징', 
  '선케어'
];

const statuses = ['판매중', '품절'];

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  flex: 1;
  padding: 10px;
  font-size: 14px;
`;

const FilterSelect = styled(Select)`
  padding: 10px;
  font-size: 14px;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const StatusTag = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  background: ${props => (props.status === '판매중' ? 'green' : 'red')};
`;

const EditLink = styled(Link)`
  color: blue;
  text-decoration: none;
  margin-right: 10px;
  &:hover {
    text-decoration: underline;
  }
`;

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

const TableFooter = styled.div`
  text-align: center;
  padding: 20px 0;
  color: #555;
  font-size: 14px;
  border-top: 1px solid #eee;
`;

const Content = styled(Card)`
  padding: ${props => props.theme.spacing.large};
`;

function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAdminProducts();
        setProducts(data);
      } catch (error) {
        console.error("상품 목록 로드 실패:", error);
        alert("상품 목록을 불러오는 데 실패했습니다.");
      }
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const handleDelete = async (product) => {
    if (window.confirm(`상품을 삭제하시겠습니까?\n\n${product.prdName}\n\n이 작업은 취소할 수 없습니다.`)) {
      try {
        await deleteAdminProduct(product.prdNo); 
        console.log(`[관리자] ${product.prdName} (ID: ${product.prdNo}) 삭제 실행`);
        setProducts(prevProducts => prevProducts.filter(p => p.prdNo !== product.prdNo));
      } catch (error) {
        console.error("상품 삭제 실패:", error);
        alert("상품 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const filteredProducts = products
    .filter(product => {
      return product.prdName.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .filter(product => {
      return selectedCategory === '' || product.categoryName === selectedCategory;
      })
      .filter(product => {
      return selectedStatus === '' || product.status === selectedStatus;
    });

  const dashboardData = {
    totalProducts: products.length,
    inStockProducts: products.filter(p => p.status === '판매중').length,
    outOfStockProducts: products.filter(p => p.status === '품절').length,
    totalStockCount: products.reduce((sum, p) => sum + p.stock, 0)
  };

  if (isLoading) {
    return <h2>관리자 페이지 로딩 중...</h2>;
  }

  return (
    <>      
      {/* --- 대시보드 --- */}
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

      {/* --- 상품 목록 --- */}
      <Content>
        <ContentHeader>
          <ContentTitle>상품 목록</ContentTitle>
          <div>
            <Button onClick={() => window.location.reload()} style={{marginRight: '10px'}}>🔄 새로고침</Button>
            <ButtonLink to="/admin/product/new" primary>
              + 상품 등록
            </ButtonLink>
            </div>
        </ContentHeader>

        {/* 검색 / 필터 */}
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

        {/* --- 상품 테이블 --- */}
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
    </>
  );
}

export default AdminProductList;