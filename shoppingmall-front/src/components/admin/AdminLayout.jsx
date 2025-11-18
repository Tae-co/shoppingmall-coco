import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../styles/admincommon';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { logout } from '../../utils/api';

const AdminWrapper = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh; /* 화면 전체 높이 보장 */
  background-color: ${props => props.theme.colors.background};
`;

const Sidebar = styled.nav`
  width: 240px; /* 너비 고정 */
  min-width: 240px; /* 창이 줄어들어도 찌그러지지 않음 */
  background: #2d3748;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
`;

const Logo = styled.h1`
  font-size: 24px;
  margin: 0 0 40px 0;
  color: white;
  font-weight: bold;
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled(Link)`
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  border-radius: 6px;
  margin-bottom: 8px;
  font-size: 15px;
  transition: all 0.2s;

  background: ${props => props.$active ? '#4a5568' : 'transparent'};
  color: ${props => props.$active ? 'white' : '#cbd5e0'};
  font-weight: ${props => props.$active ? '600' : 'normal'};
  border-left: ${props => props.$active ? '4px solid #63b3ed' : '4px solid transparent'};

  &:hover {
    background: #4a5568;
    color: white;
    transform: translateX(4px);
  }
`;

const PageWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* 내부 컨텐츠 넘침 방지 */
`;

// 관리자 전용 상단 헤더
const TopHeader = styled.header`
  height: 64px; /* 헤더 높이 고정 */
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  align-items: center;
  padding: 0 30px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
`;

// 컨텐츠 영역
const Content = styled.main`
  flex: 1; /* 헤더를 제외한 나머지 높이 차지 */
  padding: 30px;
  overflow-y: auto; /* 내용이 길어지면 스크롤 */
  background-color: #f4f7f6;
`;

function AdminLayout() {
  const location = useLocation(); // 현재 URL 정보 가져오기
  const navigate = useNavigate(); // 페이지 이동 함수

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout(); // 로컬 스토리지 토큰 삭제 등
    navigate('/login'); // 로그인 페이지로 이동 (원하는 경로로 수정 가능)
  };

  // 활성화 여부 확인 함수
  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <AdminWrapper>
      <Sidebar>
        <Logo><Link to="/admin">Coco 관리자</Link></Logo>
        <NavList>
          <li>
            <NavItem to="/admin" $active={isActive('/admin')}>
              대시보드
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/products" $active={isActive('/admin/product')}>
              상품 관리
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/categories" $active={isActive('/admin/categories')}>
              카테고리 관리
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/users" $active={isActive('/admin/users')}>
              회원 관리 (준비중)
            </NavItem>
          </li>
          <li>
            <NavItem to="/admin/orders" $active={isActive('/admin/orders')}>
              주문 관리 (준비중)
            </NavItem>
          </li>
        </NavList>
      </Sidebar>

      {/* 우측 영역 (헤더 + 본문) */}
      <PageWrapper>
        <TopHeader>
          <span style={{ marginRight: '15px', fontWeight: '500' }}>관리자(admin)님</span>
          <Button 
            as="button" 
            onClick={handleLogout} 
            $primary 
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            로그아웃
          </Button>
        </TopHeader>

        <Content>
          <Outlet /> 
        </Content>
      </PageWrapper>
      
      <ToastContainer autoClose={2000} position="bottom-right" />
    </AdminWrapper>
  );
}

export default AdminLayout;