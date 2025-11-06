import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import ComateCard from "../components/ComateCard";

const ComateCardList = () => {

    // 로그인 상태 관리 (임시)
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    // 팔로우 상태 관리 (임시)
    const [followStatus, setFollowStatus] = useState({});

    // co-mate 데이터 (임시)
    const comates = [
        {id: 1, nickname: "홍길동", skinTypes: ["건성", "민감성"], followers: 120, reviews: 15},
        {id: 2, nickname: "뷰티러버", skinTypes: ["지성", "가을웜"], followers: 300, reviews: 45},
        {id: 3, nickname: "포테이토칩", skinTypes: ["복합성", "여름뮤트"], followers: 80, reviews: 12},
        {id: 4, nickname: "익명", skinTypes: ["중성"], followers: 200, reviews: 30},
        {id: 5, nickname: "익명", skinTypes: ["중성"], followers: 200, reviews: 30}
    ];

    // 프로필 클릭-> 상세 프로필 이동
    const handleCardClick = (comateNickname) => {
        console.log(comateNickname);
    };

    const navigate = useNavigate();
    // 팔로우 버튼 클릭
    const handleFollowClick = (comateNickname) => {
        // 로그인 여부 확인
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        console.log(`${comateNickname} 팔로우`);

        // 팔로우 상태 업데이트
        // 이미 팔로잉 하고 있다면 active 버튼으로 표시
        setFollowStatus((prev) => {
            const isFollowing = prev[comateNickname] || false;
            return {
                ...prev,
                [comateNickname]: !isFollowing,
            };
        });
    };

    return (
        <div className="comate_card_list">
        {comates.map((comate) => {
            const isFollowing = followStatus[comate.nickname] || false;
            return (
                <ComateCard
                    key={comate.id}
                    nickname={comate.nickname}
                    skinTypes={comate.skinTypes}
                    followers={comate.followers + (isFollowing ? 1 : 0)}
                    reviews={comate.reviews}
                    isFollowing={isFollowing}
                    onClick={() => handleCardClick(comate.nickname)}
                    onFollowClick={() => handleFollowClick(comate.nickname)}
                />
            );
        })}
        </div>
    );
};

export default ComateCardList;