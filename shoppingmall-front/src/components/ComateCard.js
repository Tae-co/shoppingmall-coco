import React from "react";

import '../css/ComateCard.css';
import sampleImg_profile from '../images/sampleImg_profile.png'; // 임시 프로필 이미지


const ComateCard = ({nickname, skinTypes, followers, reviews, onFollowClick, onClick, isFollowing}) => {
    return (
        <div className="comate_card" onClick={onClick}>
            <div className="profile_section">
                <img src={sampleImg_profile} alt="user_profile" className="profile_img"/>
                <div className="nickname">{nickname}</div>
                <div className="skin_types">
                {skinTypes?.map((type, index) => (
                    <span key={index}>{type}</span>
                ))}
                </div>
            </div>
            <div className="stats_section">
                <div className="stat_item">
                    <div className="stat_label">팔로워</div>
                    <div className="stat_value">{followers}</div>
                </div>
                <div className="stat_item">
                    <div className="stat_label">리뷰</div>
                    <div className="stat_value">{reviews}</div>
                </div>
            </div>
            <button
                className={`follow_btn ${isFollowing ? "active" : ""}`}
                onClick={(e) => {
                    e.stopPropagation();
                    onFollowClick();
                }}
            >
            {isFollowing ? "팔로잉" : "팔로우"}
            </button>
        </div>
    );
};

export default ComateCard;