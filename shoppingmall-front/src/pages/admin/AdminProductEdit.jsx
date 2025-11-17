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
  input { margin-right: 8px; transform: scale(1.2); }
`;

const TAG_OPTIONS = {
  skinTypes: [ { id: 'dry', label: '건성' }, { id: 'oily', label: '지성' }, { id: 'combination', label: '복합성' }, { id: 'sensitive', label: '민감성' } ],
  skinConcerns: [ { id: 'hydration', label: '수분' }, { id: 'moisture', label: '보습' }, { id: 'brightening', label: '미백' }, { id: 'tone', label: '피부톤' }, { id: 'soothing', label: '진정' }, { id: 'sensitive', label: '민감' }, { id: 'uv', label: '자외선차단' }, { id: 'wrinkle', label: '주름' }, { id: 'elasticity', label: '탄력' }, { id: 'pores', label: '모공' } ],
  personalColors: [ { id: 'cool', label: '쿨톤' }, { id: 'warm', label: '웜톤' }, { id: 'neutral', label: '뉴트럴톤' } ]
};

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
    status: 'SALE',
    howToUse: '',
    skinType: [],
    skinConcern: [],
    personalColor: []
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
          status: productData.status || 'SALE',
          howToUse: productData.howToUse || '',
          skinType: productData.skinTypes || [], 
          skinConcern: productData.skinConcerns || [],
          personalColor: productData.personalColors || []
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

  // 체크박스 변경 핸들러
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

        <FormGroup>
          <Label htmlFor="howToUse">사용 방법</Label>
          <Textarea id="howToUse" name="howToUse" value={formData.howToUse} onChange={handleChange} />
        </FormGroup>

        <FormGroup>
          <Label>피부 타입</Label>
          <CheckboxGroup>
            {TAG_OPTIONS.skinTypes.map(opt => (
              <CheckboxLabel key={opt.id}>
                <input type="checkbox" checked={formData.skinType.includes(opt.id)} onChange={() => handleCheckboxChange('skinType', opt.id)} />
                {opt.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label>피부 고민</Label>
          <CheckboxGroup>
            {TAG_OPTIONS.skinConcerns.map(opt => (
              <CheckboxLabel key={opt.id}>
                <input type="checkbox" checked={formData.skinConcern.includes(opt.id)} onChange={() => handleCheckboxChange('skinConcern', opt.id)} />
                {opt.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
        </FormGroup>

        <FormGroup>
          <Label>퍼스널 컬러</Label>
          <CheckboxGroup>
            {TAG_OPTIONS.personalColors.map(opt => (
              <CheckboxLabel key={opt.id}>
                <input type="checkbox" checked={formData.personalColor.includes(opt.id)} onChange={() => handleCheckboxChange('personalColor', opt.id)} />
                {opt.label}
              </CheckboxLabel>
            ))}
          </CheckboxGroup>
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
