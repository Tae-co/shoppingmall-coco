import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// (기존 styles.container)
const Container = styled.div`
  padding: 20px;
  background: #f4f7f6;
`;

// (기존 styles.welcomeBanner)
const WelcomeBanner = styled.div`
  background: linear-gradient(90deg, #4e54c8, #8f94fb);
  color: white;
  padding: 20px 30px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
`;

// (기존 styles.welcomeTitle)
const WelcomeTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 5px 0;
`;

// (기존 styles.welcomeText)
const WelcomeText = styled.p`
  font-size: 16px;
  margin: 0;
`;

// (기존 styles.menuSection)
const MenuSection = styled.main`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

// (기존 styles.menuTitle)
const MenuTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
`;

// (기존 styles.menuButton - <Link> 태그용)
// Link 컴포넌트에 스타일을 입힐 때는 styled(Link)로 사용합니다.
const MenuLink = styled(Link)`
  display: inline-block;
  padding: 12px 20px;
  background: #333;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 15px;
  margin-right: 10px;
  transition: background 0.2s;

  &:hover {
    background: #555;
  }
`;

// (기존 styles.menuButton - <button> 태그용)
const MenuButtonDisabled = styled.button`
  display: inline-block;
  padding: 12px 20px;
  background: #aaa;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 15px;
  margin-right: 10px;
  border: none;
  cursor: not-allowed;
`;

// (기존 styles.dashboard)
const Dashboard = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  margin-top: 20px;
`;

// (기존 styles.dashCard)
const DashCard = styled.div`
  flex: 1;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const DashCardTitle = styled.p`
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
  margin-top: 0;
`;

const DashCardValue = styled.p`
  font-size: 28px;
  font-weight: bold;
  margin: 0;
`;

const DashCardTrend = styled.p`
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 0;
  
  /* props를 사용한 조건부 스타일링 예시 */
  color: ${props => (props.up ? 'green' : 'red')};
`;

// (기존 styles.mainGrid)
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

// (기존 styles.mainCard)
const MainCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  min-height: 300px;
`;

const MainCardTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 0;
`;

const ChartPlaceholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  background: #f9f9f9;
  color: #aaa;
  border-radius: 4px;
`;

// (테이블 스타일)
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  padding: 10px;
  border-bottom: 1px solid #eee;
  text-align: left;
  background: #fafafa;
`;

const Td = styled.td`
  padding: 10px;
  border-bottom: 1px solid #eee;
`;
// ---------------------------------

function AdminHome() {
  return (
    <Container>
      {/* --- 1. 상단 환영 배너 --- */}
      <WelcomeBanner>
        <WelcomeTitle>안녕하세요, 관리자님 👋</WelcomeTitle>
        <WelcomeText>오늘도 Coco와 함께 성공적인 하루를 보내세요!</WelcomeText>
      </WelcomeBanner>

      {/* --- 2. 바로가기 메뉴 --- */}
      <MenuSection>
        <MenuTitle>메뉴 바로가기</MenuTitle>
        
        <MenuLink to="/admin/products">
          상품 관리
        </MenuLink>
        
        <MenuButtonDisabled disabled>
          회원 관리 (준비중)
        </MenuButtonDisabled>
        <MenuButtonDisabled disabled>
          주문 관리 (준비중)
        </MenuButtonDisabled>
      </MenuSection>

      {/* --- 3. 4개 통계 카드 --- */}
      <Dashboard>
        <DashCard>
          <DashCardTitle>오늘 매출</DashCardTitle>
          <DashCardValue>₩19.5M</DashCardValue>
          {/* props (up)를 전달하여 글자색을 green으로 설정 */}
          <DashCardTrend up>▲ +12.5%</DashCardTrend> 
        </DashCard>
        <DashCard>
          <DashCardTitle>총 주문</DashCardTitle>
          <DashCardValue>389</DashCardValue>
          <DashCardTrend up>▲ +8.2%</DashCardTrend>
        </DashCard>
        <DashCard>
          <DashCardTitle>신규 고객</DashCardTitle>
          <DashCardValue>52</DashCardValue>
          <DashCardTrend up>▲ +15.3%</DashCardTrend>
        </DashCard>
        <DashCard>
          <DashCardTitle>전환율</DashCardTitle>
          <DashCardValue>3.2%</DashCardValue>
          {/* props (up)를 전달하지 않으면(undefined) red로 설정 */}
          <DashCardTrend>▼ -0.1%</DashCardTrend> 
        </DashCard>
      </Dashboard>

      {/* --- 4. 차트 및 목록 섹션 --- */}
      <MainGrid>
        
        {/* 주간 매출 추이 (차트) */}
        <MainCard style={{ gridColumn: 'span 2' }}> {/* gridColumn 같은 특수 CSS는 인라인으로 남겨도 편합니다 */}
          <MainCardTitle>주간 매출 추이</MainCardTitle>
          <ChartPlaceholder>
            (주간 매출 라인 차트가 표시될 영역입니다)
          </ChartPlaceholder>
        </MainCard>
        
        {/* 카테고리별 판매 (차트) */}
        <MainCard>
          <MainCardTitle>카테고리별 판매</MainCardTitle>
          <ChartPlaceholder>
            (카테고리별 바 차트가 표시될 영역입니다)
          </ChartPlaceholder>
        </MainCard>

        {/* 최근 주문 (목록) */}
        <MainCard>
          <MainCardTitle>최근 주문</MainCardTitle>
          <Table>
            <thead>
              <tr>
                <Th>주문번호</Th>
                <Th>고객명</Th>
                <Th>금액</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>ORD-2024110701</Td>
                <Td>김민지</Td>
                <Td>55,000원</Td>
              </tr>
              <tr>
                <Td>ORD-2024110702</Td>
                <Td>이서현</Td>
                <Td>28,000원</Td>
              </tr>
            </tbody>
          </Table>
        </MainCard>
      </MainGrid>

    </Container>
  );
}

export default AdminHome;