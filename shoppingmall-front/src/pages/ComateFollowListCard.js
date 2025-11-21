import React from 'react';
import { Link } from 'react-router-dom';

import '../css/ComateFollowListCard.css';
import sampleImg_profile from '../images/sampleImg_profile.png'; // 임시 프로필 이미지

const ComateUserCard = ({ memNo, nickname, skinTypes, isFollowing, onFollowClick }) => {

    return (
        <div className="uc_wrapper">
            <Link to={`/comate/user/${memNo}`}>
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
            </Link>
            <button onClick={onFollowClick}
            className={`uc_follow_btn ${isFollowing ? "active" : ""}`}
            >
            {isFollowing ? "팔로잉" : "팔로우"}
            </button>
        </div>
    );   
}

export default ComateUserCard;
