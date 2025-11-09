import React from 'react';
import styled from 'styled-components';

// --- 필터 옵션 및 태그 매핑 ---
const filterOptions = {
  skinTypes: [{ id: 'all', label: '모든 피부' }, { id: 'dry', label: '건성' }, { id: 'oily', label: '지성' }, { id: 'combination', label: '복합성' }, { id: 'sensitive', label: '민감성' }],
  skinConcerns: [
    { id: 'hydration', label: '수분' },
    { id: 'moisture', label: '보습' },
    { id: 'brightening', label: '미백' },
    { id: 'tone', label: '피부톤' },
    { id: 'soothing', label: '진정' },
    { id: 'sensitive', label: '민감' },
    { id: 'uv', label: '자외선차단' },
    { id: 'wrinkle', label: '주름' },
    { id: 'elasticity', label: '탄력' },
    { id: 'pores', label: '모공' }
  ],

  personalColors: [{ id: 'cool', label: '쿨톤' }, { id: 'warm', label: '웜톤' }, { id: 'neutral', label: '뉴트럴톤' }]
};

// 스타일 컴포넌트
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
    position: fixed;
    left: 0;
    top: 0;
    width: 300px;
    height: 100%;
    background: white;
    z-index: 1000;
    box-shadow: 4px 0 10px rgba(0,0,0,0.1);
    margin-right: 0;
    transform: ${props => (props.$isOpen ? 'translateX(0)' : 'translateX(-100%)')};
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
  }
`;

const CloseButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: block;
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

const Backdrop = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: ${props => (props.$isOpen ? 'block' : 'none')};
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
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

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 10px;
  font-size: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    color: #555;
  }
`;

const FilterCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: none; 
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

const ProductSidebar = ({
  isOpen,
  onClose,
  closeButtonRef,
  activeFilters,
  onFilterChange
}) => {
  return (
    <>
      {/* 뒷배경 */}
      <Backdrop $isOpen={isOpen} onClick={onClose} />
      
      {/* 사이드바 본체 */}
      <Sidebar $isOpen={isOpen}>
        <CloseButton ref={closeButtonRef} onClick={onClose}>
          &times;
        </CloseButton>

        <FilterTitle>필터</FilterTitle>
        
        {/* 피부타입 필터 */}
        <FilterGroup>
          <FilterGroupTitle>피부타입</FilterGroupTitle>
          {filterOptions.skinTypes.map(option => (
            <FilterLabel key={option.id}>
              <FilterCheckbox 
                checked={activeFilters.skinTypes.includes(option.id)}
                onChange={() => onFilterChange('skinType', option.id)}
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
                onChange={() => onFilterChange('skinConcern', option.id)}
              />
              <span></span>
              {option.label}
            </FilterLabel>
          ))}
        </FilterGroup> 
        
        {/* 퍼스널컬러 필터 */}
        <FilterGroup>
          <FilterGroupTitle>퍼스널컬러</FilterGroupTitle>
          {filterOptions.personalColors.map(option => (
            <FilterLabel key={option.id}>
              <FilterCheckbox 
                checked={activeFilters.personalColors.includes(option.id)}
                onChange={() => onFilterChange('personalColor', option.id)}
              />
              <span></span>
              {option.label}
            </FilterLabel>
          ))}
        </FilterGroup>

      </Sidebar>
    </>
  );
};

export default ProductSidebar;
