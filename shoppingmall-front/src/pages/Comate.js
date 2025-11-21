import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import '../css/Comate.css';

import ComateFullProfile from './ComateFullProfile';
import ComateContent from './ComateContent';
import { 
    getProfile,
    getReviewList,
    getLikedList,
    getFollowerList,
    getFollowingList,
    follow,
    unfollow
} from '../utils/comate_api';

const Comate = () => {
    const navigate = useNavigate();
    const { memNo, tab } = useParams();

    const targetMemNo = memNo;
    const [activeTab, setActiveTab] = useState(tab ||  'review');
    const [member, setMember] = useState(null);
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [reviewList, setReviewList] = useState([]);
    const [likeList, setLikeList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const [followingList, setFollowingList] = useState([]);

    /* 탭 변경 */
    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        navigate(//targetMemNo === currentMemNo 
            //? `/comate/me/${tabName}` :
            `/comate/user/${targetMemNo}/${tabName}`);
    };

    /* 팔로우/언팔로우 버튼 클릭 */
    const handleFollowClick = async () => {
        try {
            if (!member) return;
            
            if (following) {
                // await unfollow(currentMemNo, targetMemNo);
                // setIsFollowing(false);
            } else {
                // await followerList(currentMemNo, targetMemNo);
                // setIsFollowing(true);
            }
        } catch (error) {
            console.error(error);
            alert("팔로우/언팔로우 처리 중 오류가 발생했습니다.");
        }
    };

    /* 회원 기본정보 조회 */
    const loadProfile = async () => {
        setLoading(true);
        try {
            const data = await getProfile(memNo);
            setMember(data);
            // setIsFollowing(data.isFollowing || false); 
        } catch (error) {
            console.error(error);
            alert("회원 정보를 불러오는 중 오류가 발생했습니다. ");
        } finally {
            setLoading(false);
        }
    };

    /* 탭별 데이터 조회 */
    const loadTabData = async() => {
        try {
            if (!targetMemNo) return;
            switch (activeTab) {
                case 'review' :
                    setReviewList(await getReviewList(targetMemNo));
                    break;
                case 'like' :
                    setLikeList(await getLikedList(targetMemNo));
                    break;
                case 'follower' :
                    setFollowerList(await getFollowerList(targetMemNo));
                    break;
                case 'following' :
                    setFollowingList(await getFollowingList(targetMemNo));
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(error);
            alert(`${activeTab} 데이터를 불러오는 중 오류가 발생햇습니다.`);
        }
    };

    /* 처음 로딩 시 데이터 조회 */
    useEffect(() => {
        loadProfile();
    }, [targetMemNo]);

    /* 탭 변경 시 데이터 조회 */
    useEffect(() => {
        loadTabData();
    }, [activeTab, targetMemNo]);

    /* URL 파라미터 탭 변경 감지 */
    useEffect(() => {
        if (tab && tab !== activeTab) setActiveTab(tab);
    }, [tab]);

    if (loading || !member) return <div>로딩중...</div>;

    return (
        <div className="comate_wrapper">
            <ComateFullProfile
                nickname={member.memNickname}
                // skinTypes={member.skinTypes}
                likes={member.likedCount}
                followers={member.followerCount}
                following={member.followingCount}
                // userType={member.isMine ? 'me' : 'other'}
                // isFollowing={isFollowing}
                onFollowClick={handleFollowClick}
                onTabClick={handleTabClick}
            />
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
