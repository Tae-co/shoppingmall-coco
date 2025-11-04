import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 취소 버튼에 필요

// (간단한 스타일 객체)
const styles = {
  container: { padding: '20px', maxWidth: '800px', margin: 'auto', background: '#f9f9f9' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' },
  form: { background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  formGroup: { marginBottom: '20px' },
  label: { display: 'block', marginBottom: '5px', fontWeight: '600' },
  input: { width: '95%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px' },
  textarea: { width: '95%', padding: '10px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '4px', minHeight: '100px' },
  buttonContainer: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' },
  button: { padding: '12px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  buttonCancel: { background: '#eee' },
  buttonSubmit: { background: '#333', color: 'white' }
};

// 임시 카테고리 (DB에서 불러와야 함)
const categories = [
  { id: 1, name: '스킨케어' },
  { id: 2, name: '메이크업' },
  { id: 3, name: '클렌징' },
  { id: 4, name: '선케어' },
];

function AdminProductNew() {
  const navigate = useNavigate(); // '취소' 시 뒤로 가기 위한 훅

  // 폼의 각 항목을 state로 관리
  const [formData, setFormData] = useState({
    prdName: '',
    description: '',
    imageUrl: '',
    categoryNo: '', // 카테고리 ID
    prdPrice: 0,
    stock: 0
  });

  // input 값이 변경될 때 state를 업데이트하는 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // '등록' 버튼 클릭 시 실행될 핸들러
  const handleSubmit = (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 새로고침 방지

    // (실제로는 여기서 API로 formData를 서버에 전송)
    console.log('[관리자] 새 상품 등록 데이터:', formData);

    // (성공 시)
    alert(`상품이 등록되었습니다: ${formData.prdName}`);
        navigate(`/admin/products`); // 등록 완료 후 관리자 목록 페이지로 이동
    };

    // '취소' 버튼 클릭 시
    const handleCancel = () => {
        if (window.confirm('작성을 취소하시겠습니까? 변경 사항이 저장되지 않습니다.')) {
        navigate('/admin/products'); // 관리자 목록 페이지로 이동
        }
    };

    return (
    <div style={styles.container}>
      <h2 style={styles.title}>새 상품 등록</h2>
      
      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* 상품명 */}
        <div style={styles.formGroup}>
          <label htmlFor="prdName" style={styles.label}>상품명 *</label>
          <input
            type="text"
            id="prdName"
            name="prdName"
            value={formData.prdName}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        {/* 상품 설명 */}
        <div style={styles.formGroup}>
          <label htmlFor="description" style={styles.label}>상품 설명</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
          />
        </div>
        
        {/* 이미지 URL */}
        <div style={styles.formGroup}>
          <label htmlFor="imageUrl" style={styles.label}>이미지 URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            style={styles.input}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* 카테고리 */}
        <div style={styles.formGroup}>
          <label htmlFor="categoryNo" style={styles.label}>카테고리 *</label>
          <select
            id="categoryNo"
            name="categoryNo"
            value={formData.categoryNo}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="" disabled>카테고리를 선택하세요</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* 가격 */}
        <div style={styles.formGroup}>
          <label htmlFor="prdPrice" style={styles.label}>가격 *</label>
          <input
            type="number"
            id="prdPrice"
            name="prdPrice"
            value={formData.prdPrice}
            onChange={handleChange}
            style={styles.input}
            min="0"
            required
          />
        </div>

        {/* 재고 */}
        <div style={styles.formGroup}>
          <label htmlFor="stock" style={styles.label}>재고 *</label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            style={styles.input}
            min="0"
            required
          />
        </div>

        {/* 버튼 영역 */}
        <div style={styles.buttonContainer}>
          <button type="button" onClick={handleCancel} style={{...styles.button, ...styles.buttonCancel}}>
            취소
          </button>
          <button type="submit" style={{...styles.button, ...styles.buttonSubmit}}>
            등록
          </button>
        </div>

      </form>
    </div>
  );
}

export default AdminProductNew;