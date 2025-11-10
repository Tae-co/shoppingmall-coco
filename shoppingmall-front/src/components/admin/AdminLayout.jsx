import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Button } from '../../styles/admincommon';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminWrapper = styled.div`
  display: flex;
  min-height: 100vh;
`;

const Sidebar = styled.nav`
  width: 220px;
  background: #2d3748; // 어두운 배경
  color: white;
  padding: 20px;
`;

const Logo = styled.h1`
  font-size: 24px;
  margin: 0 0 30px 0;
  color: white;
  
  a {
    color: inherit;
    text-decoration: none;
  }
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled(Link)`
  display: block;
  padding: 12px 15px;
  text-decoration: none;
  color: #cbd5e0; // 연한 회색
  border-radius: 5px;
  margin-bottom: 5px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    background: #4a5568; // 호버 시 배경
  }
`;

const PageWrapper = styled.main`
  flex: 1;
  background: ${props => props.theme.colors.background};
`;

const TopHeader = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: ${props => props.theme.spacing.large}; // 20px
  background: ${props => props.theme.colors.surface}; // 흰색
  border-bottom: 1px solid ${props => props.theme.colors.border}; // #ddd
`;

const Content = styled.div`
  padding: ${props => props.theme.spacing.large};
`;

// -----------------------------

function AdminLayout() {
  return (
    <AdminWrapper>
      {/* 좌측 사이드바 (공통) */}
      <Sidebar>
        <Logo><Link to="/admin">Coco Admin</Link></Logo>
        <NavList>
          <li><NavItem to="/admin">대시보드</NavItem></li>
          <li><NavItem to="/admin/products">상품 관리</NavItem></li>
          <li><NavItem to="/admin/users">(준비중) 회원 관리</NavItem></li>
          <li><NavItem to="/admin/orders">(준비중) 주문 관리</NavItem></li>
        </NavList>
      </Sidebar>

      {/* 우측 컨텐츠 영역 */}
      <PageWrapper>
        
        {/* 공통 상단 헤더 */}
        <TopHeader>
          <span style={{ marginRight: '15px' }}>admin님</span>
          {/* 공통 Button 컴포넌트 사용 */}
          <Button as="a" href="#">로그아웃</Button>
        </TopHeader>

        {/* 페이지 컨텐츠 (<Outlet />) */}
        <Content>
          <Outlet /> 
        </Content>
        
      </PageWrapper>
      <ToastContainer autoClose={3000} />
    </AdminWrapper>
  );
}

export default AdminLayout;