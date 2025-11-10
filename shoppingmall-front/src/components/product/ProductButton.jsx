import React from 'react';
import styled from 'styled-components';

// 스타일 컴포넌트 정의
const StyledProductButton = styled.button`
  /* 공통 스타일 */
  display: inline-block; /* Link 태그와 호환되도록 */
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none; /* Link 태그용 */
  text-align: center;
  transition: background 0.2s, color 0.2s, opacity 0.2s;

  /* props.$primary에 따라 스타일 변경 
    (Transient prop '$' 사용) 
  */
  background: ${props => (props.$primary ? '#333' : 'white')};
  color: ${props => (props.$primary ? 'white' : '#333')};
  border: 1px solid #333;

  &:hover {
    background: ${props => (props.$primary ? '#555' : '#f9f9f9')};
  }

  &:disabled {
    background: #aaa;
    color: #eee;
    border-color: #aaa;
    cursor: not-allowed;
  }
`;

// 실제 사용할 React 컴포넌트
const ProductButton = ({ primary, ...props }) => {
  return <StyledProductButton $primary={primary} {...props} />;
};

export default ProductButton;