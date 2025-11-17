import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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

const CheckboxGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fafafa;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;
  
  input {
    margin-right: 8px;
    transform: scale(1.2);
  }
`;

const TAG_OPTIONS = {
  skinTypes: [
    { id: 'dry', label: '건성' }, { id: 'oily', label: '지성' }, 
    { id: 'combination', label: '복합성' }, { id: 'sensitive', label: '민감성' }
  ],
  skinConcerns: [
    { id: 'hydration', label: '수분' }, { id: 'moisture', label: '보습' },
    { id: 'brightening', label: '미백' }, { id: 'tone', label: '피부톤' },
    { id: 'soothing', label: '진정' }, { id: 'sensitive', label: '민감' },
    { id: 'uv', label: '자외선차단' }, { id: 'wrinkle', label: '주름' },
    { id: 'elasticity', label: '탄력' }, { id: 'pores', label: '모공' }
  ],
  personalColors: [
    { id: 'cool', label: '쿨톤' }, { id: 'warm', label: '웜톤' }, { id: 'neutral', label: '뉴트럴톤' }
  ]
};

function AdminProductNew() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    prdName: '',
    description: '',
    categoryNo: '',
    prdPrice: 0,
    stock: 0,
    status: 'SALE',
    howToUse: '',
    skinType: [],      // 배열로 관리 (다중 선택)
    skinConcern: [],   // 배열로 관리
    personalColor: []  // 배열로 관리
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/categories');
        if (!response.ok) throw new Error('카테고리 로드 실패');
        const data = await response.json();
        setCategories(data); // DB에서 가져온 카테고리 목록 설정
      } catch (error) {
        toast.error('카테고리 목록을 불러오지 못했습니다.');
      }
    };
    loadCategories();
  }, []);

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

  const handleCheckboxChange = (groupName, value) => {
    setFormData(prevData => {
      const currentValues = prevData[groupName];
      let newValues;

      if (currentValues.includes(value)) {
        newValues = currentValues.filter(item => item !== value);
      } else {
        newValues = [...currentValues, value];
      }

      return { ...prevData, [groupName]: newValues };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { prdName, prdPrice, stock, categoryNo } = formData;

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

    if (!categoryNo) {
      toast.warn('카테고리를 선택해주세요.');
      return;
    }

    if (!imageFile) {
      toast.warn('상품 이미지를 등록해주세요.');
      return;
    }

    const productDto = {
      prdName: formData.prdName,
      description: formData.description,
      categoryNo: Number(formData.categoryNo),
      prdPrice: Number(formData.prdPrice),
      stock: Number(formData.stock),
      status: formData.status,
      howToUse: formData.howToUse,
      skinType: formData.skinType.join(','),
      skinConcern: formData.skinConcern.join(','),
      personalColor: formData.personalColor.join(',')
    };

    const dataToSend = new FormData();

    dataToSend.append("dto", new Blob([JSON.stringify(productDto)], {
      type: "application/json"
    }));

    dataToSend.append("imageFile", imageFile);

    try {
      const response = await fetch('http://localhost:8080/api/admin/products', {
        method: 'POST',
        body: dataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '상품 등록 실패');
      }

      const newProduct = await response.json();

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
              <option key={cat.categoryNo} value={cat.categoryNo}>
                {cat.categoryName}
              </option>
            ))}
          </Select>
        </FormGroup>

        {/* 상태 선택 */}
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

        {/* 사용 방법 입력창 */}
        <FormGroup>
          <Label htmlFor="howToUse">사용 방법</Label>
          <Textarea
            id="howToUse"
            name="howToUse"
            value={formData.howToUse}
            onChange={handleChange}
            placeholder="예: 세안 후 적당량을 덜어 얼굴 전체에 펴 발라주세요."
          />
        </FormGroup>

        {/* 선택 영역 */}
        
        {/* 피부 타입 */}
        <FormGroup>
          <Label>피부 타입 (중복 선택 가능)</Label>
          <CheckboxGroup>
            {TAG_OPTIONS.skinTypes.map(opt => (
              <CheckboxLabel key={opt.id}>
                <input 
                  type="checkbox" 
                  checked={formData.skinType.includes(opt.id)}
                  onChange={() => handleCheckboxChange('skinType', opt.id)}
                />
                {opt.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        {/* 피부 고민 */}
        <FormGroup>
          <Label>피부 고민 (중복 선택 가능)</Label>
          <CheckboxGroup>
            {TAG_OPTIONS.skinConcerns.map(opt => (
              <CheckboxLabel key={opt.id}>
                <input 
                  type="checkbox" 
                  checked={formData.skinConcern.includes(opt.id)}
                  onChange={() => handleCheckboxChange('skinConcern', opt.id)}
                />
                {opt.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        {/* 퍼스널 컬러 */}
        <FormGroup>
          <Label>퍼스널 컬러 (중복 선택 가능)</Label>
          <CheckboxGroup>
            {TAG_OPTIONS.personalColors.map(opt => (
              <CheckboxLabel key={opt.id}>
                <input 
                  type="checkbox" 
                  checked={formData.personalColor.includes(opt.id)}
                  onChange={() => handleCheckboxChange('personalColor', opt.id)}
                />
                {opt.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
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