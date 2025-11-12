import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import '../css/Comate.css';

import ComateFullProfile from './ComateFullProfile';
import ComateContent from './ComateContent';

const Comate = () => {
    const {tab} = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(tab ||  'review');
    const handleTabChange = (tabName) => {
        setActiveTab(tabName);
        navigate(`/comate/${tabName}`)
    };
    
    useEffect(() => {
        if (tab && tab !== activeTab) setActiveTab(tab);
    }, [tab]);

    // co-mate 데이터 (임시)
    const profile = {nickname: "뷰티소연", skinTypes: ["건성", "민감성"], likes: 152, followers: 1280, following: 340, isFollowing: false,
        onFollowClick: () => console.log("팔로우 클릭"),
        onClick: () => console.log("프로필 클릭"),
        onTabClick: handleTabChange
    };

    const reviewList = [
        "리뷰 1: 이 제품 진짜 좋아요!",
        "리뷰 2: 촉촉하고 산뜻합니다.",
        "리뷰 3: 재구매 의사 있음!"
    ];
    const likeList = [
        "좋아요 게시물 1",
        "좋아요 게시물 2",
        "좋아요 게시물 3"
    ];
    const followerList = [
        "팔로워 유저A",
        "팔로워 유저B",
        "팔로워 유저C"
    ];
    const followingList = [
        "팔로잉 유저X",
        "팔로잉 유저Y",
        "팔로잉 유저Z"
    ];

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
