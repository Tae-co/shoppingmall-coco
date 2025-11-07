import React from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  
  // 렌더링할 게 없으면 null 반환 (예: 페이지가 1개뿐일 때)
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <PaginationContainer>
      {/* '이전' 버튼 */}
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        이전
      </PageButton>
      
      {/* 페이지 번호 버튼들 */}
      {Array.from({ length: totalPages }, (_, index) => (
        <PageButton
          key={index + 1}
          $active={index + 1 === currentPage}
          onClick={() => onPageChange(index + 1)}
        >
          {index + 1}
        </PageButton>
      ))}
      
      {/* '다음' 버튼 */}
      <PageButton 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        다음
      </PageButton>
    </PaginationContainer>
  );
};

export default Pagination;
