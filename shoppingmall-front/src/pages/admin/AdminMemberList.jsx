import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchWithAuth } from '../../utils/api';
import Pagination from '../../components/admin/Pagination';
import Spinner from '../../components/admin/Spinner';
import { toast } from 'react-toastify';

import {
  Input, Select,
  Dashboard,
  DashCard,
  DashCardTitle,
  DashCardValue,
  ContentHeader,
  ContentTitle,
  Card,
  Button,
  TableWrapper, Table, Th, Td
} from '../../styles/admincommon';

const LIMIT = 10;

const FilterContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const SearchInput = styled(Input)`
  flex: 1;
  width: auto;
  padding: 10px;
  font-size: 14px;
`;

const FilterSelect = styled(Select)`
  width: auto;
  min-width: 160px;
  padding: 10px;
  font-size: 14px;
`;

const RoleTag = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  color: white;
  font-size: 12px;
  background: ${props => (props.$role === 'ADMIN' ? '#dc3545' : '#28a745')};
`;

const TableFooter = styled.div`
  text-align: center;
  padding: 20px 0;
  color: #555;
  font-size: 14px;
  border-top: 1px solid #eee;
`;

const Content = styled(Card)`
  padding: ${props => props.theme.spacing.large};
`;

const DateText = styled.span`
  font-size: 12px;
  color: #666;
`;

function AdminMemberList() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  const [dashboardStats, setDashboardStats] = useState({
    totalMembers: 0,
    adminCount: 0,
    userCount: 0
  });

  useEffect(() => {
    loadMembers();
  }, [currentPage, searchTerm, selectedRole]);

  const loadMembers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        size: LIMIT.toString(),
      });

      if (searchTerm) {
        params.append('searchTerm', searchTerm);
      }
      if (selectedRole && selectedRole !== 'ALL') {
        params.append('role', selectedRole);
      }

      const response = await fetchWithAuth(`/member/admin/list?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setMembers(data.members || []);
        setTotalPages(data.totalPages || 0);
        setTotalMembers(data.totalElements || 0);
        setDashboardStats(data.stats || {
          totalMembers: 0,
          adminCount: 0,
          userCount: 0
        });
      } else {
        throw new Error(data.message || '회원 목록을 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error("회원 목록 로드 실패:", error);
      toast.error(error.message || "회원 목록을 불러오는 데 실패했습니다.");
    }
    setIsLoading(false);
  };

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {/* --- 대시보드 --- */}
      <Dashboard>
        <DashCard>
          <DashCardTitle>전체 회원</DashCardTitle>
          <DashCardValue>{dashboardStats.totalMembers}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>일반 회원</DashCardTitle>
          <DashCardValue>{dashboardStats.userCount}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>관리자</DashCardTitle>
          <DashCardValue>{dashboardStats.adminCount}</DashCardValue>
        </DashCard>
        <DashCard>
          <DashCardTitle>현재 페이지</DashCardTitle>
          <DashCardValue>{currentPage} / {totalPages || 1}</DashCardValue>
        </DashCard>
      </Dashboard>

      {/* --- 회원 목록 --- */}
      <Content>
        <ContentHeader>
          <ContentTitle>회원 관리</ContentTitle>
          <div>
            <Button onClick={loadMembers} style={{ marginRight: '10px' }}>🔄 새로고침</Button>
          </div>
        </ContentHeader>

        {/* 검색 / 필터 */}
        <FilterContainer>
          <SearchInput
            type="text"
            placeholder="아이디, 닉네임, 이메일, 이름으로 검색..."
            value={searchTerm}
            onChange={handleFilterChange(setSearchTerm)}
          />

          <FilterSelect
            value={selectedRole}
            onChange={handleFilterChange(setSelectedRole)}
          >
            <option value="ALL">전체 권한</option>
            <option value="USER">일반 회원</option>
            <option value="ADMIN">관리자</option>
          </FilterSelect>
        </FilterContainer>

        {/* --- 회원 테이블 --- */}
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <Th>회원번호</Th>
                <Th>아이디</Th>
                <Th>닉네임</Th>
                <Th>이름</Th>
                <Th>이메일</Th>
                <Th>전화번호</Th>
                <Th>권한</Th>
                <Th>포인트</Th>
                <Th>가입일</Th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.memNo}>
                    <Td>{member.memNo}</Td>
                    <Td>{member.memId}</Td>
                    <Td>{member.memNickname || '-'}</Td>
                    <Td>{member.memName || '-'}</Td>
                    <Td>{member.memMail || '-'}</Td>
                    <Td>{member.memHp || '-'}</Td>
                    <Td>
                      <RoleTag $role={member.role}>
                        {member.role === 'ADMIN' ? '관리자' : '일반회원'}
                      </RoleTag>
                    </Td>
                    <Td>{member.point ? member.point.toLocaleString() : 0}P</Td>
                    <Td>
                      <DateText>{formatDate(member.memJoindate)}</DateText>
                    </Td>
                  </tr>
                ))
              ) : (
                <tr>
                  <Td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>
                    검색 결과가 없습니다.
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </TableWrapper>

        <TableFooter>
          총 {totalMembers}명의 회원
        </TableFooter>

        {/* 페이지네이션*/}
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}

      </Content>
    </>
  );
}

export default AdminMemberList;

