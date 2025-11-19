import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../css/Home_Comate.css';

import ComateMiniProfile from "../components/ComateMiniProfile";

function Home_Comate() {
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 5,
        slideToScroll: 1,
        speed: 500,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        focusOnSelect: true
    };

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
        {id: 5, nickname: "이몽룡", skinTypes: ["봄웜"], followers: 800, reviews: 300},
        {id: 6, nickname: "코스메틱러버", skinTypes: ["지성", "겨울쿨"], followers: 150, reviews: 25},
        {id: 7, nickname: "뷰티마스터", skinTypes: ["복합성", "가을웜"], followers: 500, reviews: 60}
    ];

    // 프로필 클릭-> 상세 프로필 이동
    const handleCardClick = (comateId) => {
        //navigate(`/comate/user/${comateId}/review`);
        // 무조건 홍길동 클릭 가정 (임시)
        navigate('/comate/user/1/review');
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
    <div className="comate-slider-container">
        <Slider {...settings}>
            {comates.map((comate) => {
                const isFollowing = followStatus[comate.nickname] || false;
                return (
                    <div key={comate.id}>
                        <ComateMiniProfile
                            nickname={comate.nickname}
                            skinTypes={comate.skinTypes}
                            followers={comate.followers + (isFollowing ? 1 : 0)}
                            reviews={comate.reviews}
                            isFollowing={isFollowing}
                            onClick={() => handleCardClick(comate.id)}
                            onFollowClick={() => handleFollowClick(comate.nickname)}
                        />
                    </div>
                );
            })}
        </Slider>
    </div>
  );
}

export default Home_Comate;