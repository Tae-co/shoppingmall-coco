import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams 추가
import styled from 'styled-components';

// --- (가짜 데이터 및 카테고리) ---

// 임시 카테고리 (DB에서 불러와야 함)
const categories = [
  { id: 1, name: '스킨케어' },
  { id: 2, name: '메이크업' },
  { id: 3, name: '클렌징' },
  { id: 4, name: '선케어' },
];

// --- 가짜 데이터 (Mock Data) ---
// AdminProductList의 데이터를 수정 페이지 로드용으로 사용
const mockAdminProducts = {
  '1': { prdNo: 1, prdName: '히알루론산 수분 세럼', prdPrice: 35000, imageUrl: 'https://picsum.photos/id/75/100/100', categoryNo: '1', stock: 150, description: '수분 가득 세럼입니다.' },
  '2': { prdNo: 2, prdName: '쿠션 파운데이션 23호', prdPrice: 28000, imageUrl: 'https://picsum.photos/id/102/100/100', categoryNo: '2', stock: 80, description: '커버력 좋은 쿠션입니다.' },
  '3': { prdNo: 3, prdName: '딥 클렌징 오일', prdPrice: 24000, imageUrl: 'https://picsum.photos/id/103/100/100', categoryNo: '3', stock: 65, description: '' },
  '4': { prdNo: 4, prdName: '비타민C 브라이트닝 크림', prdPrice: 42000, imageUrl: 'https://picsum.photos/id/104/100/100', categoryNo: '1', stock: 0, description: '' },
};
// ---------------------------------

// --- 스타일 컴포넌트 정의  ---

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  font-size: 14px;
`;

const CommonInputStyle = `
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Input = styled.input`
  ${CommonInputStyle}
`;

const Textarea = styled.textarea`
  ${CommonInputStyle}
  min-height: 100px;
  resize: vertical;
`;

const Select = styled.select`
  ${CommonInputStyle}
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s;

  background: ${props => (props.primary ? '#333' : '#eee')};
  color: ${props => (props.primary ? 'white' : '#333')};

  &:hover {
    opacity: 0.8;
  }
`;
// ---------------------------------

function AdminProductEdit() {
  const navigate = useNavigate();
  const { productId } = useParams(); // URL에서 상품 ID 가져오기 (예: '1')

  // 폼의 각 항목을 state로 관리
  const [formData, setFormData] = useState({
    prdName: '',
    description: '',
    imageUrl: '',
    categoryNo: '',
    prdPrice: 0,
    stock: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  // 페이지 로드 시 (또는 productId 변경 시) 기존 상품 데이터 불러오기
  useEffect(() => {
    // (실제로는 API로 `/api/admin/products/${productId}` 호출)
    console.log(`[관리자] ${productId}번 상품 데이터 로드 시도...`);
    setIsLoading(true);
    
    setTimeout(() => { // API 호출 시뮬레이션
      const foundProduct = mockAdminProducts[productId];
      if (foundProduct) {
        setFormData(foundProduct); // 찾은 상품 데이터로 폼 상태 설정
      } else {
        alert('존재하지 않는 상품입니다.');
        navigate('/admin/products');
      }
      setIsLoading(false);
    }, 500); // 0.5초 딜레이
    
  }, [productId, navigate]); // productId가 바뀔 때마다 다시 실행

  // input 값이 변경될 때 state를 업데이트하는 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // '수정' 버튼 클릭 시 실행될 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // (실제로는 여기서 API로 formData를 서버에 전송 - PUT 또는 PATCH)
    console.log(`[관리자] ${productId}번 상품 수정 데이터:`, formData);
    
    alert(`상품이 수정되었습니다: ${formData.prdName}`);
    navigate('/admin/products'); // 수정 완료 후 관리자 목록 페이지로 이동
  };

  // '취소' 버튼 클릭 시
  const handleCancel = () => {
    if (window.confirm('수정을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) {
      navigate('/admin/products'); // 관리자 목록 페이지로 이동
    }
  };

  if (isLoading) {
    return <Container><h2>상품 정보 로딩 중...</h2></Container>;
  }

  return (
    <Container>
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
          <Button type="button" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" primary>
            수정 완료
          </Button>
        </ButtonContainer>

      </Form>
    </Container>
  );
}

export default AdminProductEdit;