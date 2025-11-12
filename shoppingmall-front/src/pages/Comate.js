import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../css/Comate.css';

import ComateFullProfile from './ComateFullProfile';
import ComateContent from './ComateContent';

const Comate = ({ userType }) => {
    const { tab, userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(tab ||  'review');

    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        if (userType === 'me')
            navigate(`/comate/me/${tabName}`);
        else
            navigate(`/comate/user/${userId}/${tabName}`);
    };
    
    useEffect(() => {
        if (tab && tab !== activeTab) setActiveTab(tab);
    }, [tab]);

    // co-mate 데이터 (임시)
    const reviewList = [
        {
          id: 1,
          productName: "촉촉 수분크림",
          productOption: "옵션: [기획특가] 300ml",
          productImg: "/images/sample_product1.jpg",
          createdAt: "2025-11-12",
          rating: 4.5,
          content: "이거 바르고 나서 피부 진짜 촉촉해졌어요!",
          tags: ["수분감좋음", "촉촉", "가벼운질감"],
          likeCount: 3
        },
        {
          id: 2,
          productName: "진정 토너",
          productOption: "옵션: 150ml+150ml 리필 증정 기획",
          productImg: "/images/sample_product2.jpg",
          createdAt: "2025-11-10",
          rating: 5.0,
          content: "민감한 피부에도 자극 없고 진정 효과 최고예요.",
          tags: ["진정효과", "민감피부용"],
          likeCount: 0
        },
        {
          id: 3,
          productName: "데일리 선크림",
          productOption: "",
          productImg: "/images/sample_product3.jpg",
          createdAt: "2025-11-08",
          rating: 3.8,
          content: "백탁 거의 없어요. 여름에 쓰기 딱 좋아요.",
          tags: ["가벼움", "백탁없음"],
          likeCount: 0
        },
    ]; 
    const likeList = [
        {
          id: 101,
          productName: "톤업 크림",
          productOption: "옵션: 100ml",
          productImg: "/images/sample_product4.jpg",
          createdAt: "2025-11-11",
          rating: 4.2,
          content: "피부가 자연스럽게 환해져요.",
          tags: ["톤업효과", "자연스러움"],
          likeCount: 2
        }
    ];
    const followerList = [
        {
          id: 1,
          nickname: "뷰티하늘",
          skinTypes: ["건성", "민감성"],
          profileImg: "https://via.placeholder.com/80",
          isFollowing: false
        },
        {
          id: 2,
          nickname: "민감러버",
          skinTypes: ["건성", "민감성"],
          profileImg: "https://via.placeholder.com/80",
          isFollowing: false
        },
        {
          id: 3,
          nickname: "촉촉미소",
          skinTypes: ["건성", "민감성"],
          profileImg: "https://via.placeholder.com/80",
          isFollowing: true
        }
    ];
    const followingList = [
        {
            id: 3,
            nickname: "촉촉미소",
            skinTypes: ["건성", "민감성"],
            profileImg: "https://via.placeholder.com/80",
            isFollowing: true
        },
        {
            id: 4,
            nickname: "스킨러버",
            skinTypes: ["건성", "민감성"],
            profileImg: "https://via.placeholder.com/80",
            isFollowing: true
        },
        {
            id: 5,
            nickname: "글로우마스터",
            skinTypes: ["건성", "민감성"],
            profileImg: "https://via.placeholder.com/80",
            isFollowing: true
        }
    ];

    const profile = userType === 'me' 
    ? {
        nickname: "뷰티소연", skinTypes: ["건성", "민감성"], 
        likes: likeList.length,
        followers: followerList.length, 
        following: followingList.length, 
        isFollowing: false,
        onFollowClick: () => console.log("팔로우 클릭"),
        onClick: () => console.log("프로필 클릭"),
        onTabClick: handleTabChange,
        userType
    } 
    : {
        nickname: "홍길동", skinTypes: ["지성", "홍조", "가을웜"], 
        likes: likeList.length,
        followers: followerList.length, 
        following: followingList.length, 
        isFollowing: false,
        onFollowClick: () => console.log("팔로우 클릭"),
        onClick: () => console.log("프로필 클릭"),
        onTabClick: handleTabChange,
        userType
    };

    return (
        <div className="comate_wrapper">
            <ComateFullProfile {... profile} />
            <ComateContent 
                activeTab={activeTab}
                reviewList={reviewList}
                likeList={likeList}
                followerList={followerList}
                followingList={followingList}
            />
        </div>
    );   
}

export default Comate;
