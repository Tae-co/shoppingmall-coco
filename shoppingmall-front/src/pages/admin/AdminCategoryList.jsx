import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Spinner from '../../components/admin/Spinner';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../api/mockApi';
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
  flex: 1; /* Input이 길게 늘어나도록 */
  margin-bottom: 0;
`;

const CategoryTable = styled(Table)`
  min-width: 0; /* 상품 테이블과 달리 꽉 차지 않아도 됨 */
`;

const ActionButton = styled(Button)`
  padding: 5px 10px;
  font-size: 12px;
  margin-right: 5px;
  
  /* $danger prop을 받으면 빨간색 버튼 */
  background: ${props => (props.$danger ? props.theme.colors.danger : '#eee')};
  color: ${props => (props.$danger ? 'white' : props.theme.colors.text)};
`;

function AdminCategoryList() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (error) {
      toast.error('카테고리 로드에 실패했습니다.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setIsLoading(true);
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (newCategoryName.trim() === '') {
      toast.warn('카테고리 이름을 입력하세요.');
      return;
    }
    try {
      await createCategory(newCategoryName);
      toast.success(`'${newCategoryName}' 카테고리가 추가되었습니다.`);
      setNewCategoryName('');
      await loadCategories();
    } catch (error) {
      toast.error('카테고리 추가에 실패했습니다.');
    }
  };

  const handleEditCategory = async (category) => {
    const newName = window.prompt('새 카테고리 이름을 입력하세요:', category.name);
    
    if (newName && newName.trim() !== '' && newName.trim() !== category.name) {
      try {
        await updateCategory(category.id, newName.trim());
        toast.success('카테고리 이름이 수정되었습니다.');
        await loadCategories();
      } catch (error) {
        toast.error('카테고리 수정에 실패했습니다.');
      }
    }
  };
  
  const handleDeleteCategory = async (category) => {
    if (window.confirm(`'${category.name}' 카테고리를 삭제하시겠습니까?`)) {
      try {
        await deleteCategory(category.id);
        toast.success(`'${category.name}' 카테고리가 삭제되었습니다.`);
        await loadCategories();
      } catch (error) {
        toast.error('카테고리 삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <Title>카테고리 관리</Title>

      {/* --- 새 카테고리 추가 폼 --- */}
      <FormContainer>
        <ContentTitle>새 카테고리 추가</ContentTitle>
        <AddForm onSubmit={handleAddCategory}>
          <AddInputGroup>
            <Label htmlFor="newCategoryName" style={{marginBottom: '5px'}}>카테고리 이름</Label>
            <Input
              type="text"
              id="newCategoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="예: 신상품"
            />
          </AddInputGroup>
          <Button type="submit" $primary>추가</Button>
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
              <Th style={{width: '100px'}}>ID</Th>
              <Th>카테고리 이름</Th>
              <Th style={{width: '150px'}}>관리</Th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id}>
                <Td>{cat.id}</Td>
                <Td>{cat.name}</Td>
                <Td>
                  <ActionButton 
                    onClick={() => handleEditCategory(cat)}
                  >
                    수정
                  </ActionButton>
                  <ActionButton 
                    $danger 
                    onClick={() => handleDeleteCategory(cat)}
                  >
                    삭제
                  </ActionButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </CategoryTable>
      </Card>
    </>
  );
}

export default AdminCategoryList;