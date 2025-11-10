import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createAdminProduct } from '../../api/mockApi';

import {
  Title,
  FormGroup,
  Label,
  Input,
  Textarea,
  Select,
  ButtonContainer,
  Button,
  Card
} from '../../styles/admincommon';

// 임시 카테고리 (DB에서 불러와야 함)
const categories = [
  { id: 1, name: '스킨케어' },
  { id: 2, name: '메이크업' },
  { id: 3, name: '클렌징' },
  { id: 4, name: '선케어' },
];

const Form = styled(Card).attrs({ as: 'form' })`
  padding: ${props => props.theme.spacing.xlarge};
  max-width: 800px;
  margin: auto;
`;

function AdminProductNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prdName: '',
    description: '',
    imageUrl: '',
    categoryNo: '',
    prdPrice: 0,
    stock: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createAdminProduct(formData);

      console.log('[관리자] 새 상품 등록 데이터:', formData);
      alert(`상품이 등록되었습니다: ${formData.prdName}`);
      navigate(`/admin/products`);

    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm('작성을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) {
      navigate('/admin/products');
    }
  };

  return (
    <>
      <Title>새 상품 등록</Title>

      <Form onSubmit={handleSubmit}>

        {/* 상품명 */}
        <FormGroup>
          <Label htmlFor="prdName">상품명 *</Label>
          <Input
            type="text"
            id="prdName"
            name="prdName"
            value={formData.prdName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        {/* 상품 설명 */}
        <FormGroup>
          <Label htmlFor="description">상품 설명</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </FormGroup>

        {/* 이미지 URL */}
        <FormGroup>
          <Label htmlFor="imageUrl">이미지 URL</Label>
          <Input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </FormGroup>

        {/* 카테고리 */}
        <FormGroup>
          <Label htmlFor="categoryNo">카테고리 *</Label>
          <Select
            id="categoryNo"
            name="categoryNo"
            value={formData.categoryNo}
            onChange={handleChange}
            required
          >
            <option value="" disabled>카테고리를 선택하세요</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </FormGroup>

        {/* 가격 */}
        <FormGroup>
          <Label htmlFor="prdPrice">가격 *</Label>
          <Input
            type="number"
            id="prdPrice"
            name="prdPrice"
            value={formData.prdPrice}
            onChange={handleChange}
            min="0"
            required
          />
        </FormGroup>

        {/* 재고 */}
        <FormGroup>
          <Label htmlFor="stock">재고 *</Label>
          <Input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            required
          />
        </FormGroup>

        {/* 버튼 영역 */}
        <ButtonContainer>
          {/* '취소' 버튼 */}
          <Button type="button" onClick={handleCancel}>
            취소
          </Button>
          {/* '등록' 버튼 (primary prop 전달) */}
          <Button type="submit" primary>
            등록
          </Button>
        </ButtonContainer>

      </Form>
    </>
  );
}

export default AdminProductNew;