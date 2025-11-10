import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { fetchAdminProductById, updateAdminProduct } from '../../api/mockApi';
import Spinner from '../../components/admin/Spinner';
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

const categories = [
  { id: 1, name: '스킨케어' },
  { id: 2, name: '메이크업' },
  { id: 3, name: '클렌징' },
  { id: 4, name: '선케어' },
];

const CurrentImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
`;

function AdminProductEdit() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [formData, setFormData] = useState({
    prdName: '',
    description: '',
    imageUrl: '',
    categoryNo: '',
    prdPrice: 0,
    stock: 0
  });
  const [newImageFile, setNewImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      console.log(`[관리자] ${productId}번 상품 데이터 로드 시도...`);
      setIsLoading(true);
      try {
        const foundProduct = await fetchAdminProductById(productId);
        setFormData(foundProduct);
      } catch (error) {
        console.error(error);
        toast.error('존재하지 않는 상품이거나 로드에 실패했습니다.');
        navigate('/admin/products');
      }
      setIsLoading(false);
    };

    loadProduct();

  }, [productId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { prdName, prdPrice, stock } = formData;

    if (!prdName || prdName.trim() === "") {
      toast.error('상품명을 입력해주세요.');
      return;
    }

    const priceNum = Number(prdPrice);
    const stockNum = Number(stock);

    if (priceNum <= 0) {
      toast.error('가격은 0보다 커야 합니다.');
      return;
    }

    if (stockNum < 0) {
      toast.error('재고는 0개 이상이어야 합니다.');
      return;
    }

    const productData = new FormData();
    productData.append('prdName', prdName);
    productData.append('description', formData.description);
    productData.append('categoryNo', formData.categoryNo);
    productData.append('prdPrice', priceNum);
    productData.append('stock', stockNum);

    if (newImageFile) {
      productData.append('imageFile', newImageFile);
    } else {
      productData.append('imageUrl', formData.imageUrl);
    }

    try {
      await updateAdminProduct(productId, productData);

      toast.success(`상품이 수정되었습니다: ${prdName}`);
      navigate('/admin/products');

    } catch (error) {
      console.error("상품 수정 실패:", error);
      toast.error("상품 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) {
      navigate('/admin/products');
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Title>상품 수정 (ID: {productId})</Title>

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

        {/* 이미지 폼 */}
        <FormGroup>
          <Label htmlFor="imageFile">상품 이미지</Label>
          {/* 기존 이미지 미리보기 */}
          {formData.imageUrl && !newImageFile && (
            <div>
              <CurrentImage src={formData.imageUrl} alt="기존 이미지" />
              <p style={{ fontSize: '12px', color: '#777' }}>
                (현재 이미지)
              </p>
            </div>
          )}

          {/* 새 이미지 파일 선택 */}
          <Label htmlFor="imageFile" style={{ fontSize: '12px', fontWeight: 'normal' }}>
            {formData.imageUrl ? '이미지 교체' : '새 이미지 등록 *'}
          </Label>
          <Input
            type="file"
            id="imageFile"
            name="imageFile"
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/gif"
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
          <Button type="button" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" $primary>
            수정 완료
          </Button>
        </ButtonContainer>

      </Form>
    </>
  );
}

export default AdminProductEdit;
