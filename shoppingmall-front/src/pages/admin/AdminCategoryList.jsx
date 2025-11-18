import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Spinner from '../../components/admin/Spinner';
import {
  Title,
  Card,
  ContentHeader,
  ContentTitle,
  FormGroup,
  Label,
  Input,
  Button,
  Table, Th, Td
} from '../../styles/admincommon';

const FormContainer = styled(Card)`
  margin-bottom: 20px;
`;

const AddForm = styled.form`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

const AddInputGroup = styled(FormGroup)`
  flex: 1;
  margin-bottom: 0;
`;

const CategoryTable = styled(Table)`
  min-width: 0;
`;

const ActionButton = styled(Button)`
  padding: 5px 10px;
  font-size: 12px;
  margin-right: 5px;
  
  background: ${props => (props.$danger ? props.theme.colors.danger : '#eee')};
  color: ${props => (props.$danger ? 'white' : props.theme.colors.text)};
`;

function AdminCategoryList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [parentCategoryNo, setParentCategoryNo] = useState('');
  const [editId, setEditId] = useState(null);

  // 목록 조회 (GET)
  const loadCategories = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/categories');
      if (!response.ok) throw new Error('로드 실패');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error(error);
      toast.error('카테고리 로드 실패');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // 초기화 함수
  const resetForm = () => {
    setNewCategoryName('');
    setParentCategoryNo('');
    setEditId(null);
  };

  // 폼 제출 핸들러 (추가 / 수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') {
      toast.warn('카테고리 이름을 입력하세요.');
      return;
    }

    // 부모 카테고리 값 정리 (빈 문자열이면 null로)
    const parentNoValue = parentCategoryNo === '' ? null : parentCategoryNo;

    const categoryData = {
      categoryName: newCategoryName,
      parentCategoryNo: parentNoValue
    };

    try {
      let url = 'http://localhost:8080/api/admin/categories';
      let method = 'POST';

      // 수정 모드라면 URL과 Method 변경
      if (editId) {
        url = `http://localhost:8080/api/admin/categories/${editId}`;
        method = 'PUT';
      }

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData)
      });

      if (!response.ok) throw new Error('작업 실패');

      toast.success(editId ? '수정되었습니다.' : '추가되었습니다.');
      resetForm();
      await loadCategories();

    } catch (error) {
      console.error(error);
      toast.error('작업에 실패했습니다.');
    }
  };

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (category) => {
    setEditId(category.categoryNo);
    setNewCategoryName(category.categoryName);

    if (category.parentCategory) {
      setParentCategoryNo(category.parentCategory.categoryNo);
    } else {
      setParentCategoryNo('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 삭제 (DELETE)
  const handleDeleteCategory = async (category) => {
    if (window.confirm(`'${category.categoryName}' 카테고리를 삭제하시겠습니까?`)) {
      try {
        const response = await fetch(`http://localhost:8080/api/admin/categories/${category.categoryNo}`, {
          method: 'DELETE'
        });

        if (!response.ok) throw new Error('삭제 실패');

        toast.success(`'${category.categoryName}' 카테고리가 삭제되었습니다.`);
        await loadCategories();
      } catch (error) {
        console.error(error);
        toast.error('카테고리 삭제에 실패했습니다.');
      }
    }
  };

  // 계층 구조로 정렬하여 렌더링하는 함수
  const renderCategoryRows = () => {
    // 대분류(최상위 부모)만 골라내기
    const parents = categories.filter(cat => !cat.parentCategory && !cat.parentCategoryNo);

    return parents.map(parent => {
      // 해당 부모의 자식(소분류) 찾기
      const children = categories.filter(cat => {
          const parentId = cat.parentCategory ? cat.parentCategory.categoryNo : cat.parentCategoryNo;
          return parentId === parent.categoryNo;
      });

      return (
        <React.Fragment key={parent.categoryNo}>
          {/* 대분류 렌더링 */}
          <tr style={{ fontWeight: 'bold', backgroundColor: '#f9f9f9' }}>
            <Td>{parent.categoryNo}</Td>
            <Td style={{ textAlign: 'left', paddingLeft: '20px' }}>
                {parent.categoryName}
            </Td>
            <Td>
              <ActionButton onClick={() => handleEditClick(parent)}>수정</ActionButton>
              <ActionButton $danger onClick={() => handleDeleteCategory(parent)}>삭제</ActionButton>
            </Td>
          </tr>

          {/* 소분류 렌더링 (들여쓰기 효과) */}
          {children.map(child => (
            <tr key={child.categoryNo}>
              <Td style={{ color: '#888' }}>{child.categoryNo}</Td>
              <Td style={{ textAlign: 'left', paddingLeft: '50px' }}>
                └ {child.categoryName}
              </Td>
              <Td>
                <ActionButton onClick={() => handleEditClick(child)}>수정</ActionButton>
                <ActionButton $danger onClick={() => handleDeleteCategory(child)}>삭제</ActionButton>
              </Td>
            </tr>
          ))}
        </React.Fragment>
      );
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Title>카테고리 관리</Title>

      {/* --- 새 카테고리 추가 폼 --- */}
      <FormContainer>
        <ContentTitle>
          {editId ? '카테고리 수정' : '새 카테고리 추가'}
        </ContentTitle>
        <AddForm onSubmit={handleSubmit}>
          <AddInputGroup>
            <Label>상위 카테고리</Label>
            <select
              value={parentCategoryNo}
              onChange={(e) => setParentCategoryNo(e.target.value)}
              style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
            >
              <option value="">[선택 안 함] 새로운 카테고리 생성</option>
              {categories
                .filter(cat => !cat.parentCategory && !cat.parentCategoryNo)
                .map((cat) => (
                  cat.categoryNo !== editId && (
                    <option key={cat.categoryNo} value={cat.categoryNo}>
                      {cat.categoryName}
                    </option>
                  )
                ))}
            </select>
          </AddInputGroup>

          <AddInputGroup>
            <Label>카테고리 이름</Label>
            <Input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="예: 스킨케어, 크림 등"
            />
          </AddInputGroup>

          {/* 버튼 그룹 */}
          <div style={{ display: 'flex', gap: '5px' }}>
            <Button type="submit" $primary>{editId ? '수정 완료' : '추가'}</Button>
            {editId && <Button type="button" onClick={resetForm} style={{ background: '#6c757d', color: 'white' }}>취소</Button>}
          </div>
        </AddForm>
      </FormContainer>

      {/* --- 카테고리 목록 --- */}
      <Card>
        <ContentHeader>
          <ContentTitle>카테고리 목록</ContentTitle>
        </ContentHeader>
        <CategoryTable>
          <thead>
            <tr>
              <Th style={{ width: '100px' }}>ID</Th>
              <Th>카테고리 이름</Th>
              <Th style={{ width: '150px' }}>관리</Th>
            </tr>
          </thead>
          <tbody>
            {renderCategoryRows()}
          </tbody>
        </CategoryTable>
      </Card>
    </>
  );
}

export default AdminCategoryList;