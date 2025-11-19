import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Spinner from '../../components/admin/Spinner';
import { toast } from 'react-toastify';
import TagCheckboxGroup from '../../components/admin/TagCheckboxGroup';
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

const TAG_OPTIONS = {
  skinTypes: [{ id: 'dry', label: '건성' }, { id: 'oily', label: '지성' }, { id: 'combination', label: '복합성' }, { id: 'sensitive', label: '민감성' }],
  skinConcerns: [{ id: 'hydration', label: '수분' }, { id: 'moisture', label: '보습' }, { id: 'brightening', label: '미백' }, { id: 'tone', label: '피부톤' }, { id: 'soothing', label: '진정' }, { id: 'sensitive', label: '민감' }, { id: 'uv', label: '자외선차단' }, { id: 'wrinkle', label: '주름' }, { id: 'elasticity', label: '탄력' }, { id: 'pores', label: '모공' }],
  personalColors: [{ id: 'cool', label: '쿨톤' }, { id: 'warm', label: '웜톤' }, { id: 'neutral', label: '뉴트럴톤' }]
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
    status: 'SALE',
    howToUse: '',
    skinType: [],
    skinConcern: [],
    personalColor: []
  });

  const [categories, setCategories] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState([]);

  // 옵션 변경 핸들러
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...options];
    newOptions[index][field] = value;
    setOptions(newOptions);
  };

  // 옵션 추가 핸들러
  const handleAddOption = () => {
    setOptions([...options, { optionName: '', optionValue: '', addPrice: 0, stock: 0 }]);
  };

  // 옵션 삭제 핸들러
  const handleRemoveOption = (index) => {
    if (options.length === 1) {
      alert("최소 1개의 옵션은 있어야 합니다.");
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

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

        // 기존 옵션 데이터 로드
        if (productData.options && productData.options.length > 0) {
          setOptions(productData.options);
        } else {
          // 옵션이 없으면 기본값 하나 추가
          setOptions([{ optionName: '기본', optionValue: '', addPrice: 0, stock: 0 }]);
        }

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

    const { prdName, prdPrice, categoryNo } = formData;

    if (!prdName || prdName.trim() === "") {
      toast.error('상품명을 입력해주세요.');
      return;
    }

    const productDto = {
      prdName: prdName,
      description: formData.description,
      categoryNo: Number(categoryNo),
      prdPrice: Number(prdPrice),
      status: formData.status,
      howToUse: formData.howToUse,
      skinType: formData.skinType.join(','),
      skinConcern: formData.skinConcern.join(','),
      personalColor: formData.personalColor.join(','),

      // 옵션 리스트
      options: options.map(opt => ({
        optionNo: opt.optionNo || null,
        optionName: opt.optionName,
        optionValue: opt.optionValue,
        addPrice: Number(opt.addPrice),
        stock: Number(opt.stock)
      }))
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
            <div style={{ marginBottom: '10px' }}>
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

        {/* 피부 타입 */}
        <TagCheckboxGroup
          label="피부 타입"
          groupName="skinType"
          options={TAG_OPTIONS.skinTypes}
          selectedValues={formData.skinType}
          onChange={handleCheckboxChange}
        />

        {/* 피부 고민 */}
        <TagCheckboxGroup
          label="피부 고민"
          groupName="skinConcern"
          options={TAG_OPTIONS.skinConcerns}
          selectedValues={formData.skinConcern}
          onChange={handleCheckboxChange}
        />

        {/* 퍼스널 컬러 */}
        <TagCheckboxGroup
          label="퍼스널 컬러"
          groupName="personalColor"
          options={TAG_OPTIONS.personalColors}
          selectedValues={formData.personalColor}
          onChange={handleCheckboxChange}
        />

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

        <div style={{ marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <Label>상품 옵션 관리</Label>
          
          {/* 옵션 컬럼 헤더 */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', color: '#666', paddingLeft: '4px' }}>
            <span style={{ width: '20%' }}>옵션명</span>
            <span style={{ flex: 1 }}>옵션값</span>
            <span style={{ width: '15%' }}>추가금(원)</span>
            <span style={{ width: '15%' }}>재고(개)</span>
            <span style={{ width: '60px', textAlign: 'center' }}>관리</span>
          </div>

          {options.map((opt, index) => (
            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
              <Input 
                placeholder="예: 용량" 
                value={opt.optionName} 
                onChange={(e) => handleOptionChange(index, 'optionName', e.target.value)} 
                style={{ width: '20%' }} 
              />
              <Input 
                placeholder="예: 50ml" 
                value={opt.optionValue} 
                onChange={(e) => handleOptionChange(index, 'optionValue', e.target.value)} 
                style={{ flex: 1 }} 
              />
              <Input 
                type="number" 
                placeholder="0" 
                value={opt.addPrice} 
                onChange={(e) => handleOptionChange(index, 'addPrice', e.target.value)} 
                style={{ width: '15%' }} 
              />
              <Input 
                type="number" 
                placeholder="0" 
                value={opt.stock} 
                onChange={(e) => handleOptionChange(index, 'stock', e.target.value)} 
                style={{ width: '15%' }} 
              />
              <Button 
                type="button" 
                onClick={() => handleRemoveOption(index)} 
                style={{ backgroundColor: '#ff6b6b', color: 'white', padding: '10px', width: '60px', fontSize: '13px' }}
              >
                삭제
              </Button>
            </div>
          ))}

          <Button type="button" onClick={handleAddOption} style={{ width: '100%', background: '#fff', border: '1px dashed #ccc', color: '#555', marginTop: '10px' }}>
            + 옵션 추가하기
          </Button>
        </div>

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
