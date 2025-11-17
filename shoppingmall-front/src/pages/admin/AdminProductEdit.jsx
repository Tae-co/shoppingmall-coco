import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
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
    stock: 0,
    status: 'SALE'
  });

  const [categories, setCategories] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const catResponse = await fetch('http://localhost:8080/api/categories');
        if (!catResponse.ok) throw new Error('카테고리 로드 실패');
        const categoryData = await catResponse.json();
        setCategories(categoryData);
        
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!response.ok) throw new Error('상품 정보를 불러올 수 없습니다.');

        const productData = await response.json();

        setFormData({
          prdName: productData.prdName,
          description: productData.description || '',
          imageUrl: productData.imageUrls?.[0] || '',
          stock: productData.options?.[0]?.stock || 0, 
          prdPrice: productData.prdPrice,
          categoryNo: productData.categoryNo || '', 
          status: productData.status || 'SALE'
        });

      } catch (error) {
        console.error(error);
        toast.error('데이터 로드에 실패했습니다.');
        navigate('/admin/products');
      }
      setIsLoading(false);
    };
    loadData();
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

  // 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { prdName, prdPrice, stock, categoryNo } = formData;

    if (!prdName || prdName.trim() === "") {
      toast.error('상품명을 입력해주세요.');
      return;
    }

    const productDto = {
      prdName: prdName,
      description: formData.description,
      categoryNo: Number(categoryNo),
      prdPrice: Number(prdPrice),
      stock: Number(stock),
      status: formData.status
    };

    const dataToSend = new FormData();
    dataToSend.append("dto", new Blob([JSON.stringify(productDto)], {
      type: "application/json"
    }));

    // 새 파일이 있을 때만 전송
    if (newImageFile) {
      dataToSend.append("imageFile", newImageFile);
    }

    try {
      const response = await fetch(`http://localhost:8080/api/admin/products/${productId}`, {
        method: 'PUT',
        body: dataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "상품 수정 실패");
      }

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
            <div style={{marginBottom: '10px'}}>
               <CurrentImage src={formData.imageUrl} alt="기존 이미지" /> 
              <p style={{ fontSize: '12px', color: '#777' }}>
                (현재 등록된 이미지)
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
              <option key={cat.categoryNo} value={cat.categoryNo}>
                {cat.categoryName}
              </option>
            ))}
          </Select>
        </FormGroup>

        {/* 상태 수정 */}
        <FormGroup>
          <Label htmlFor="status">상품 상태</Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="SALE">판매중</option>
            <option value="SOLD_OUT">품절</option>
            <option value="STOP">판매중지</option>
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
