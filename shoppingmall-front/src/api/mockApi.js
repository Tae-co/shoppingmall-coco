const mockAdminProducts = [
  { prdNo: 1, prdName: '히알루론산 수분 세럼', prdPrice: 35000, imageUrl: 'https://picsum.photos/id/100/100/100', categoryName: '스킨케어', categoryNo: '1', stock: 150, status: '판매중', description: '...' },
  { prdNo: 2, prdName: '쿠션 파운데이션 23호', prdPrice: 28000, imageUrl: 'https://picsum.photos/id/101/100/100', categoryName: '메이크업', categoryNo: '2', stock: 80, status: '판매중', description: '...' },
  { prdNo: 3, prdName: '딥 클렌징 오일', prdPrice: 24000, imageUrl: 'https://picsum.photos/id/102/100/100', categoryName: '클렌징', categoryNo: '3', stock: 65, status: '판매중', description: '...' },
  { prdNo: 4, prdName: '비타민C 브라이트닝 크림', prdPrice: 42000, imageUrl: 'https://picsum.photos/id/103/100/100', categoryName: '스킨케어', categoryNo: '1', stock: 0, status: '품절', description: '...' },
  {
    prdNo: 5,
    prdName: '데일리 선스크린 SPF50',
    prdPrice: 19000,
    imageUrl: 'https://picsum.photos/id/107/100/100',
    categoryName: '선케어',
    categoryNo: '4',
    stock: 200,
    status: '판매중',
    description: '매일 바르기 좋은 선크림'
  },
  {
    prdNo: 6,
    prdName: '매트 립스틱 (클래식 레드)',
    prdPrice: 22000,
    imageUrl: 'https://picsum.photos/id/106/100/100',
    categoryName: '메이크업',
    categoryNo: '2',
    stock: 120,
    status: '판매중',
    description: '클래식한 레드 립스틱'
  },
  {
    prdNo: 7,
    prdName: '진정 시카 크림',
    prdPrice: 31000,
    imageUrl: 'https://picsum.photos/id/107/100/100',
    categoryName: '스킨케어',
    categoryNo: '1',
    stock: 50,
    status: '판매중',
    description: '민감성 피부를 위한 시카 크림'
  },
  {
    prdNo: 8,
    prdName: '포어 클리어링 토너',
    prdPrice: 25000,
    imageUrl: 'https://picsum.photos/id/108/100/100',
    categoryName: '스킨케어',
    categoryNo: '1',
    stock: 90,
    status: '판매중',
    description: '모공 케어용 토너'
  },
  {
    prdNo: 9,
    prdName: '워터프루프 아이라이너',
    prdPrice: 15000,
    imageUrl: 'https://picsum.photos/id/109/100/100',
    categoryName: '메이크업',
    categoryNo: '2',
    stock: 0,
    status: '품절',
    description: '번짐 없는 아이라이너'
  },
  {
    prdNo: 10,
    prdName: '마일드 클렌징 폼',
    prdPrice: 18000,
    imageUrl: 'https://picsum.photos/id/110/100/100',
    categoryName: '클렌징',
    categoryNo: '3',
    stock: 75,
    status: '판매중',
    description: '순한 성분의 클렌징 폼'
  },
  {
    prdNo: 11,
    prdName: '쿨링 선 스틱',
    prdPrice: 23000,
    imageUrl: 'https://picsum.photos/id/111/100/100',
    categoryName: '선케어',
    categoryNo: '4',
    stock: 110,
    status: '판매중',
    description: '휴대용 선 스틱'
  },
  {
    prdNo: 12,
    prdName: '아이섀도우 팔레트 (브라운)',
    prdPrice: 45000,
    imageUrl: 'https://picsum.photos/id/112/100/100',
    categoryName: '메이크업',
    categoryNo: '2',
    stock: 40,
    status: '판매중',
    description: '데일리 음영 팔레트'
  },
];

// (GET /api/admin/products) - 목록 조회 (AdminProductList)
export const fetchAdminProducts = ({
  page = 1,
  limit = 6,
  searchTerm = '',
  selectedCategory = '',
  selectedStatus = ''
}) => {
  console.log('[Mock API] 상품 목록 조회', { page, limit, searchTerm, selectedCategory, selectedStatus });

  return new Promise((resolve) => {
    const filtered = mockAdminProducts
      .filter(product => {
        return product.prdName.toLowerCase().includes(searchTerm.toLowerCase());
      })
      .filter(product => {
        return selectedCategory === '' || product.categoryName === selectedCategory;
      })
      .filter(product => {
        return selectedStatus === '' || product.status === selectedStatus;
      });

      
    const inStockCount = filtered.filter(p => p.status === '판매중').length;
    const outOfStockCount = filtered.filter(p => p.status === '품절').length;
    const totalStock = filtered.reduce((sum, p) => sum + p.stock, 0);

    // --- 페이지네이션 ---
    const totalProducts = filtered.length;
    const totalPages = Math.ceil(totalProducts / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedProducts = filtered.slice(startIndex, endIndex);

    setTimeout(() => {
      resolve({
        products: paginatedProducts,
        totalPages: totalPages,
        totalProducts: totalProducts,
        dashboardCounts: {
          inStock: inStockCount,
          outOfStock: outOfStockCount,
          totalStock: totalStock
        }
      });
    }, 500);
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
export const createAdminProduct = (productData) => {
  if (productData instanceof FormData) {
    console.log('[Mock API] 새 상품 등록 (FormData 받음)');
    
    console.log('상품명:', productData.get('prdName'));
    console.log('파일:', productData.get('imageFile'));
    
  } else {
    console.error('[Mock API] 오류: FormData 형식이 아닙니다.');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ 
        prdNo: 999, 
        prdName: productData.get('prdName'),
      });
    }, 500);
  });
};

// (PUT /api/admin/products/:id) - 수정 (AdminProductEdit)
export const updateAdminProduct = (productId, productData) => {
  console.log(`[Mock API] ${productId}번 상품 수정:`);

  const newImageFile = productData.get('imageFile');
  const existingImageUrl = productData.get('imageUrl');

  let finalImageUrl = '';

  if (newImageFile) {
    console.log('[Mock API] 새 이미지 파일 감지:', newImageFile.name);
    finalImageUrl = 'https://picsum.photos/id/999/100/100';
  } else {
    console.log('[Mock API] 기존 이미지 URL 사용:', existingImageUrl);
    finalImageUrl = existingImageUrl;
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        prdNo: productId,
        prdName: productData.get('prdName'),
        imageUrl: finalImageUrl,
      });
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

// ===========================================
// 카테고리 API
// ===========================================

// 카테고리 Mock 데이터
const mockCategories = [
  { id: 1, name: '스킨케어' },
  { id: 2, name: '메이크업' },
  { id: 3, name: '클렌징' },
  { id: 4, name: '선케어' },
];

// (GET /api/admin/categories) - 카테고리 목록 조회
export const fetchCategories = () => {
  console.log('[Mock API] 카테고리 목록 조회');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCategories);
    }, 300);
  });
};

// (POST /api/admin/categories) - 카테고리 생성
export const createCategory = (categoryName) => {
  console.log('[Mock API] 새 카테고리 생성:', categoryName);
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...mockCategories.map(c => c.id)) + 1;
      const newCategory = { id: newId, name: categoryName };
      mockCategories.push(newCategory);
      resolve(newCategory);
    }, 300);
  });
};

// (PUT /api/admin/categories/:id) - 카테고리 수정
export const updateCategory = (categoryId, newName) => {
  console.log(`[Mock API] ${categoryId}번 카테고리 수정:`, newName);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const category = mockCategories.find(c => c.id === categoryId);
      if (category) {
        category.name = newName;
        resolve(category);
      } else {
        reject(new Error('카테고리를 찾을 수 없습니다.'));
      }
    }, 300);
  });
};

// (DELETE /api/admin/categories/:id) - 카테고리 삭제
export const deleteCategory = (categoryId) => {
  console.log(`[Mock API] ${categoryId}번 카테고리 삭제`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockCategories.findIndex(c => c.id === categoryId);
      if (index > -1) {
        mockCategories.splice(index, 1);
        resolve({ success: true });
      } else {
        reject(new Error('카테고리를 찾을 수 없습니다.'));
      }
    }, 300);
  });
};