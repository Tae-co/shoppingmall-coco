const mockAdminProducts = [
  { prdNo: 1, prdName: '히알루론산 수분 세럼', prdPrice: 35000, imageUrl: '...', categoryName: '스킨케어', categoryNo: '1', stock: 150, status: '판매중', description: '...' },
  { prdNo: 2, prdName: '쿠션 파운데이션 23호', prdPrice: 28000, imageUrl: '...', categoryName: '메이크업', categoryNo: '2', stock: 80, status: '판매중', description: '...' },
  { prdNo: 3, prdName: '딥 클렌징 오일', prdPrice: 24000, imageUrl: '...', categoryName: '클렌징', categoryNo: '3', stock: 65, status: '판매중', description: '...' },
  { prdNo: 4, prdName: '비타민C 브라이트닝 크림', prdPrice: 42000, imageUrl: '...', categoryName: '스킨케어', categoryNo: '1', stock: 0, status: '품절', description: '...' },
];

// (GET /api/admin/products) - 목록 조회 (AdminProductList)
export const fetchAdminProducts = () => {
  console.log('[Mock API] 상품 목록 조회');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockAdminProducts); // 전체 목록 반환
    }, 500); // 0.5초 딜레이 시뮬레이션
  });
};

// (GET /api/admin/products/:id) - 상세 조회 (AdminProductEdit)
export const fetchAdminProductById = (productId) => {
  console.log(`[Mock API] ${productId}번 상품 상세 조회`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = mockAdminProducts.find(p => p.prdNo.toString() === productId);
      if (product) {
        resolve(product);
      } else {
        reject(new Error('상품을 찾을 수 없습니다.'));
      }
    }, 500);
  });
};

// (POST /api/admin/products) - 신규 등록 (AdminProductNew)
export const createAdminProduct = (formData) => {
  console.log('[Mock API] 새 상품 등록:', formData);
  return new Promise((resolve) => {
    setTimeout(() => {
      // (실제로는 DB에 저장 후 반환)
      resolve({ ...formData, prdNo: 999 }); // 임시 ID
    }, 500);
  });
};

// (PUT /api/admin/products/:id) - 수정 (AdminProductEdit)
export const updateAdminProduct = (productId, formData) => {
  console.log(`[Mock API] ${productId}번 상품 수정:`, formData);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(formData);
    }, 500);
  });
};

// (DELETE /api/admin/products/:id) - 삭제 (AdminProductList)
export const deleteAdminProduct = (productId) => {
   console.log(`[Mock API] ${productId}번 상품 삭제`);
   return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: '삭제 완료' });
    }, 500);
  });
};