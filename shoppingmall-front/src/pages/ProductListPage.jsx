import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import ProductButton from '../components/product/ProductButton';


// --- 필터 옵션 및 태그 매핑 ---
const filterOptions = {
  skinTypes: [ { id: 'dry', label: '건성' }, { id: 'oily', label: '지성' }, { id: 'combination', label: '복합성' }, { id: 'sensitive', label: '민감성' } ],
  skinConcerns: [ { id: 'hydration', label: '수분/보습' }, { id: 'brightening', label: '미백' }, { id: 'pores', label: '모공' }, { id: 'soothing', label: '진정' }, { id: 'uv', label: '자외선차단' } ]
};
const skinTypeMap = {
  dry: '건성',
  oily: '지성',
  combination: '복합성',
  sensitive: '민감성'
};

// 한 페이지에 보여줄 아이템 개수
const ITEMS_PER_PAGE = 6;
// ---------------------------------

// 스타일 컴포넌트 정의

// 스켈레톤 로딩 애니메이션
const shimmer = keyframes`
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
`;

// 스켈레톤 공통 스타일
const SkeletonBase = styled.div`
  background: #f0f0f0;
  background-image: linear-gradient(to right, #f0f0f0 0%, #e8e8e8 20%, #f0f0f0 40%, #f0f0f0 100%);
  background-repeat: no-repeat;
  background-size: 800px 100%;
  border-radius: 4px;
  animation: ${shimmer} 1.5s linear infinite;
`;

// 스켈레톤 카드
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

const PageContainer = styled.div`
  display: flex;
  padding: 20px 40px;
  max-width: 1280px;
  margin: 0 auto;

  /* 모바일 미디어 쿼리 추가 */
  @media (max-width: 768px) {
    /* 모바일에서는 좌우 여백 줄임 */
    padding: 10px;
  }
`;

// 필터 사이드바 스타일
const Sidebar = styled.aside`
  /* --- 데스크톱 스타일 --- */
  width: 240px;
  margin-right: 30px;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;

  /* 모바일 스타일 */
  @media (max-width: 768px) {
    position: fixed; /* 화면에 고정 (컨텐츠 위로 뜸) */
    left: 0;
    top: 0;
    width: 300px; /* 모바일에서 열릴 때 너비 */
    height: 100%;
    background: white;
    z-index: 1000; /* 다른 요소들보다 위에 있도록 */
    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
    margin-right: 0;
    
    /* prop($isOpen) 값에 따라 보이고 숨겨짐 */
    transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease-in-out;
    overflow-y: auto; /* 모바일에서도 스크롤 유지 */
  }
`;

// 모바일 필터 닫기 버튼
const CloseButton = styled.button`
  display: none; /* 데스크톱에선 숨김 */

  @media (max-width: 768px) {
    display: block; /* 모바일에서만 보임 */
    font-size: 24px;
    font-weight: bold;
    border: none;
    background: none;
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 15px;
    color: #555;
  }
`;

// 필터 열렸을 때 뒤쪽 컨텐츠 어둡게 하는 배경
const Backdrop = styled.div`
  display: none; /* 데스크톱에선 숨김 */

  @media (max-width: 768px) {
    display: ${props => (props.$isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999; /* 사이드바 바로 뒤 */
  }
`;

const FilterTitle = styled.h3`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
  border-bottom: 2px solid #333;
  padding-bottom: 10px;
`;

const FilterGroup = styled.div`
  margin-bottom: 25px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
`;

const FilterGroupTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 15px;
`;

// 체크박스를 감싸는 라벨을
const FilterLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;

  /* 마우스 올리면 살짝 연해지기 */
  &:hover {
    color: #555;
  }
`;

// 기본 체크박스는 숨김
const FilterCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none; 
  
  /* 체크됐을 때(checked)의 스타일을 라벨이 아닌,
     체크박스 아이콘(:before)과 텍스트(span)에 적용 */
  
  /* 가짜 체크박스 아이콘 만들기 */
  + span {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 1px solid #ccc;
    border-radius: 3px;
    margin-right: 10px;
    position: relative;
    top: -1px;
  }
  
  /* 체크됐을 때 가짜 아이콘에 V 표시 */
  &:checked + span {
    background: #333;
    border-color: #333;
    &::before {
      content: '✔';
      color: white;
      font-size: 12px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
`;

const MainContent = styled.main`
  flex: 1;
`;

// 검색창 스타일
const SearchContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px 20px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
`;

// 상품 개수와 정렬 필터를 담는 상단 바
const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 8px;
  position: sticky;
  top: 0;
  z-index: 10;
`;

// 모바일용 필터 열기 버튼
const FilterButton = styled.button`
  display: none; /* 데스크톱에선 숨김 */
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block; /* 모바일에서만 보임 */
    margin-right: 10px;
  }
`;

const TopBarControls = styled.div`
  display: flex;
  align-items: center;
`;

const ProductCount = styled.span`
  font-size: 16px;
  font-weight: 600;
  & strong {
    color: #4e54c8; /* 포인트 컬러 */
  }
`;

const SortSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
`;

const ProductListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px; /* 간격 살짝 넓힘 */
`;

// Link 컴포넌트에 스타일 + :hover 효과
const ProductCard = styled(Link)`
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  text-decoration: none;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  /* 마우스를 올리면 카드가 살짝 위로 이동하고 그림자가 진해짐 */
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

// 이미지 외의 컨텐츠를 감싸는 래퍼 (padding 적용)
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

// 페이지네이션 스타일
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px; /* 목록과 간격 */
`;

const PageButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  border: 1px solid ${props => (props.$active ? '#333' : '#ddd')};
  background: ${props => (props.$active ? '#333' : 'white')};
  color: ${props => (props.$active ? 'white' : '#333')};
  cursor: pointer;
  border-radius: 4px;
  font-weight: ${props => (props.$active ? 'bold' : 'normal')};
  
  &:hover {
    background: ${props => (props.$active ? '#333' : '#f0f0f0')};
  }

  &:disabled {
    background: #f9f9f9;
    color: #ccc;
    cursor: not-allowed;
  }
`;
// -------------------------------

// 스켈레톤 카드를 렌더링하는 컴포넌트
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

function ProductListPage() {
  const [products, setProducts] = useState([]); // API 응답의 content 배열
  const [totalPages, setTotalPages] = useState(0); // 총 페이지 개수
  const [totalElements, setTotalElements] = useState(0); // 총 상품 개수

  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const closeButtonRef = useRef(null);

  // URL에서 현재 상태 읽어오기
  const searchTerm = searchParams.get('q') || '';
  const sortOrder = searchParams.get('sort') || 'popularity';
  const currentPage = Number(searchParams.get('page')) || 1;
  const activeFilters = {
    skinTypes: searchParams.getAll('skinType'),
    skinConcerns: searchParams.getAll('skinConcern'),
  };

  // 전체 상품 목록은 처음에 한 번만 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // 로딩 시작

      try {
        // searchParams를 API URL 쿼리 스트링으로 변환
        const queryString = searchParams.toString();

        // 실제 API 호출
        const response = await fetch(`http://localhost:8080/api/products?${queryString}`);

        if(!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }

        const data = await response.json();

        setProducts(data.content);
        setTotalPages(data.totalPages);
        setTotalElements(data.totalElements);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    };

    fetchProducts(); // 함수 실행
  }, [searchParams]); // searchParams가 변경될 때마다 useEffect 다시 실행

  // isFilterOpen 상태가 변경될 때 포커스를 제어하는 useEffect
  useEffect(() => {
    if (isFilterOpen) {
      // 필터가 열리면, 0.1초 뒤 닫기 버튼에 포커스
      setTimeout(() => {
        closeButtonRef.current?.focus(); // .current가 실제 DOM 요소를 가리킴
      }, 100); // 100ms 딜레이
    }
  }, [isFilterOpen]); // isFilterOpen이 바뀔 때마다 실행

  // URL 파라미터를 업데이트하는 공통 함수
  const updateSearchParams = (newParams, resetPage = true) => {
    // 현재 URL의 모든 파라미터를 복사
    const params = new URLSearchParams(searchParams);
    
    // 새 파라미터 적용 (e.g., {q: '세럼'}, {sort: 'newest'})
    for (const [key, value] of Object.entries(newParams)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key); // 값이 없으면 URL에서 제거
      }
    }
    
    // 페이지 변경이 아닌 경우, 1페이지로 리셋
    if (resetPage) {
      params.set('page', '1');
    }
    
    setSearchParams(params);
  };
  
  // 배열(필터)을 위한 핸들러
  const handleFilterChange = (category, value) => {
    const currentValues = searchParams.getAll(category);
    let newValues;

    if (currentValues.includes(value)) {
      newValues = currentValues.filter(item => item !== value);
    } else {
      newValues = [...currentValues, value];
    }

    const params = new URLSearchParams(searchParams);
    params.delete(category);
    newValues.forEach(val => params.append(category, val));
    params.set('page', '1');
    setSearchParams(params);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('q', e.target.value);
    params.set('page', '1');
    setSearchParams(params);
  };
  
  // 정렬 변경 핸들러
  const handleSortChange = (e) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', e.target.value);
    params.set('page', '1');
    setSearchParams(params);
  };
  
  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    setSearchParams(params);
  };

  const handleAddToCart = (e) => {
    e.preventDefault(); 
    console.log('장바구니 담기 클릭!');
  };

  // 로딩이 끝나고 상품을 화면에 그리기
  return (
    <PageContainer>
      {/* 뒷배경. 클릭하면 필터 닫힘 */}
      <Backdrop $isOpen={isFilterOpen} onClick={() => setIsFilterOpen(false)} />
      
      {/* $isOpen prop 전달 */}
      <Sidebar $isOpen={isFilterOpen}>
        {/* 닫기 버튼 */}
        <CloseButton ref={closeButtonRef} onClick={() => setIsFilterOpen(false)}>
          &times;
        </CloseButton>

      {/* --- 필터 사이드바 --- */}
        <FilterTitle>필터</FilterTitle>
        
          {/* 피부타입 필터 */}
          <FilterGroup>
            <FilterGroupTitle>피부타입</FilterGroupTitle>
            {filterOptions.skinTypes.map(option => (
              <FilterLabel key={option.id}>
                <FilterCheckbox 
                  checked={activeFilters.skinTypes.includes(option.id)}
                  onChange={() => handleFilterChange('skinType', option.id)}
                />
                <span></span>
                {option.label}
              </FilterLabel>
            ))}
          </FilterGroup>
        
          {/* 피부고민 필터 */}
          <FilterGroup>
            <FilterGroupTitle>피부고민</FilterGroupTitle>
            {filterOptions.skinConcerns.map(option => (
              <FilterLabel key={option.id}>
                <FilterCheckbox 
                  checked={activeFilters.skinConcerns.includes(option.id)}
                  onChange={() => handleFilterChange('skinConcern', option.id)}
                />
                <span></span>
                {option.label}
              </FilterLabel>
            ))}
          </FilterGroup> 
      </Sidebar>

      {/* --- 메인 상품 목록 --- */}
      <MainContent>
        {/* 검색창 UI */}
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="상품명으로 검색..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchContainer>

        {/* 상단 바 (상품 개수, 정렬) */}
        <TopBar>
          <TopBarControls>
            {/* 필터 열기 버튼 */}
            <FilterButton onClick={() => setIsFilterOpen(true)}>
              필터
            </FilterButton>
            <ProductCount>
              총 <strong>{totalElements}</strong>개 상품
            </ProductCount>
          </TopBarControls>
          
          <SortSelect 
            value={sortOrder} 
            onChange={handleSortChange}
          >
            <option value="popularity">인기순</option>
            <option value="newest">최신순</option>
            <option value="priceAsc">가격 낮은 순</option>
            <option value="priceDesc">가격 높은 순</option>
          </SortSelect>
        </TopBar>

        {/* --- 로딩 / 비어있음 / 데이터 있음 분기 --- */}
        {isLoading ? (
          <ProductListSkeleton />
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#888' }}>
            <h3>검색 결과가 없습니다</h3>
            <p>필터 조건을 다시 확인해 주세요.</p>
          </div>
        ) : (
          // 로딩 끝 & 상품 있음: 실제 데이터
          <>
            <ProductListGrid>
              {products.map((product) => (
                <ProductCard key={product.prdNo} to={`/products/${product.prdNo}`}>
                  <ProductImage src={product.imageUrl} alt={product.prdName} loading="lazy"/>
                  <CardContent>
                    <ProductName>{product.prdName}</ProductName>
                    <ProductRating>
                      ⭐ {product.averageRating} ({product.reviewCount})
                    </ProductRating>
                    <TagContainer>
                      {product.skinTypes?.map(type => (
                        <Tag key={type}># {skinTypeMap[type] || type}</Tag>
                      ))}
                    </TagContainer>
                    <ProductPrice>{product.prdPrice.toLocaleString()}원</ProductPrice>
                    <SimpleReview>{product.simpleReview}</SimpleReview>
                    <ProductButton onClick={handleAddToCart} $primary style={{ marginTop: '12px' }}>
                      장바구니 담기
                    </ProductButton>
                  </CardContent>
                </ProductCard>
              ))}
            </ProductListGrid>

            {/* 페이지네이션 UI 렌더링 */}
            <PaginationContainer>
              <PageButton 
                onClick={() => handlePageChange(currentPage - 1)} 
                disabled={currentPage === 1}
              >
                이전
              </PageButton>
              {Array.from({ length: totalPages }, (_, index) => (
                <PageButton
                  key={index + 1}
                  $active={index + 1 === currentPage}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </PageButton>
              ))}
              <PageButton 
                onClick={() => handlePageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
              >
                다음
              </PageButton>
            </PaginationContainer>
          </>
        )}
      </MainContent>
    </PageContainer>
  );
}

export default ProductListPage;