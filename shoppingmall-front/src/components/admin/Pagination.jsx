import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin-top: ${props => props.theme.spacing.large};
`;

const PageButton = styled.button`
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => (props.active ? props.theme.colors.primary : props.theme.colors.surface)};
  color: ${props => (props.active ? props.theme.colors.surface : props.theme.colors.text)};
  padding: 8px 12px;
  margin: 0 2px;
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: 14px;
  
  &:disabled {
    background: #eee;
    color: #aaa;
    cursor: not-allowed;
  }
`;

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 페이지 번호 배열 생성 (예: [1, 2, 3])
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // 총 페이지가 1 이하면 아무것도 렌더링하지 않음
  if (totalPages <= 1) {
    return null;
  }

  return (
    <Nav>
      {/* '이전' 버튼 */}
      <PageButton 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
      >
        &lt;
      </PageButton>

      {/* 페이지 번호 버튼들 */}
      {pageNumbers.map(number => (
        <PageButton
          key={number}
          onClick={() => onPageChange(number)}
          active={number === currentPage}
        >
          {number}
        </PageButton>
      ))}

      {/* '다음' 버튼 */}
      <PageButton 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
      >
        &gt;
      </PageButton>
    </Nav>
  );
}

export default Pagination;