import React from 'react';

import '../css/UserCard.css';
import sampleImg_profile from '../images/sampleImg_profile.png'; // 임시 프로필 이미지

const UserCard = ({ nickname, skinTypes, isFollowing, onFollowClick }) => {

    return (
        <div className="uc_wrapper">
            <div className="uc_info_wrapper">
                <img src={sampleImg_profile} alt={nickname} className="profile_img"/>
                <div className="uc_info">
                    <div className="nickname">{nickname}</div>
                    <div className="skin_types">
                        {skinTypes?.map((type, index) => (
                            <span key={index}>{type}</span>
                        ))}
                    </div>
                </div>
            </div>
            <button onClick={onFollowClick}
            className={`uc_follow_btn ${isFollowing ? "active" : ""}`}
            >
            {isFollowing ? "팔로잉" : "팔로우"}
            </button>
        </div>
    );   
}

export default UserCard;
