import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { createAdminProduct, fetchCategories } from '../../api/mockApi';
import { toast } from 'react-toastify';
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
    categoryNo: '',
    prdPrice: 0,
    stock: 0
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        toast.error('카테고리 목록을 불러오지 못했습니다.');
      }
    };
    loadCategories();
  }, []); // [] : 페이지 로드 시 1회 실행

  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { prdName, prdPrice, stock } = formData;

    if (!prdName || prdName.trim() === "") {
      toast.warn('상품명을 입력해주세요.');
      return;
    }

    const priceNum = Number(prdPrice);
    const stockNum = Number(stock);

if (priceNum <= 0) {
      toast.warn('가격은 0보다 커야 합니다.');
      return;
    }

    if (stockNum < 0) {
      toast.warn('재고는 0개 이상이어야 합니다.');
      return;
    }
    
    if (!imageFile) {
      toast.warn('상품 이미지를 등록해주세요.');
      return;
    }

    const newProductData = new FormData();
    newProductData.append('prdName', prdName);
    newProductData.append('description', formData.description);
    newProductData.append('categoryNo', formData.categoryNo);
    newProductData.append('prdPrice', priceNum);
    newProductData.append('stock', stockNum);
    newProductData.append('imageFile', imageFile);
    
    try {
      await createAdminProduct(newProductData); 
      
      toast.success(`상품이 등록되었습니다: ${prdName}`);
      navigate(`/admin/products`);

    } catch (error) {
      console.error("상품 등록 실패:", error);
      toast.error("상품 등록 중 오류가 발생했습니다.");
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

        {/* 이미지 파일 */}
        <FormGroup>
          <Label htmlFor="imageFile">이미지 파일 *</Label>
          <Input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
            required
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
          <Button type="submit" $primary>
            등록
          </Button>
        </ButtonContainer>

      </Form>
    </>
  );
}

export default AdminProductNew;