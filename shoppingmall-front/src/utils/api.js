const API_BASE_URL = 'http://localhost:8080/api';

// JWT 토큰이 포함된 인증 헤더 생성
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// JWT 토큰을 포함한 인증 API 요청 처리
export const fetchWithAuth = async (url, options = {}) => {
  const headers = getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
  
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('member');
    localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
    throw new Error('인증이 만료되었습니다.');
  }
  
  return response;
};

// 인증이 필요하지 않은 일반 API 요청 처리
export const fetchWithoutAuth = async (url, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
};

// 로그인 상태 확인
export const isLoggedIn = () => {
  return !!localStorage.getItem('token');
};

// 로그아웃 처리 및 저장된 인증 정보 제거
export const logout = (options = {}) => {
  localStorage.removeItem('token');
  localStorage.removeItem('member');
  localStorage.removeItem('isLoggedIn');
  window.dispatchEvent(new Event('loginStatusChanged'));
  if (options.redirectTo) {
    window.location.href = options.redirectTo;
  }
};

// 로컬에 저장된 회원 정보 조회
export const getStoredMember = () => {
  try {
    return JSON.parse(localStorage.getItem('member') || '{}');
  } catch (error) {
    console.error('저장된 회원 정보 파싱 오류:', error);
    return {};
  }
};

// 일반 로그인 처리
export const login = async ({ memId, memPwd }) => {
  const response = await fetchWithoutAuth('/member/login', {
    method: 'POST',
    body: JSON.stringify({ memId, memPwd }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
  }

  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  localStorage.setItem('member', JSON.stringify(data));
  localStorage.setItem('isLoggedIn', 'true');

  window.dispatchEvent(new Event('loginStatusChanged'));
  return data;
};



