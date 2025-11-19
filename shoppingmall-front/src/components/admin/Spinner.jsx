import React from 'react';
import styled, { keyframes } from 'styled-components';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// 스타일
const SpinnerWheel = styled.div`
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3; /* 회색 트랙 */
  border-top: 6px solid ${props => props.theme.colors.primary}; /* 메인 색상 */
  border-radius: 50%;
  animation: ${rotate} 1s linear infinite; /* 1초마다 회전 */
`;

const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px;
  min-height: 300px;
`;

function Spinner() {
  return (
    <SpinnerWrapper>
      <SpinnerWheel />
    </SpinnerWrapper>
  );
}

export default Spinner;