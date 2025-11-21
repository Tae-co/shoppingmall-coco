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
import { getCurrentMember } from '../utils/api';

const Comate = () => {
    const navigate = useNavigate();
    const { memNo, tab } = useParams();

    const [loginUser, setLoginUser] = useState(null);
    const [targetMemNo, setTargetMemNo] = useState(null);
    const [userType, setUserType] = useState('user');

    const [activeTab, setActiveTab] = useState(tab ||  'review');
    const [member, setMember] = useState(null);
    const [following, setFollowing] = useState(false);
    const [loading, setLoading] = useState(true);

    const [reviewList, setReviewList] = useState([]);
    const [likeList, setLikeList] = useState([]);
    const [followerList, setFollowerList] = useState([]);
    const [followingList, setFollowingList] = useState([]);

    const isMine = userType === 'me';

    useEffect(() => {
        const initUser = async () => {
            try {
                const current = await getCurrentMember();
                setLoginUser(current);

                if (!memNo || memNo === current.memNo.toString()) {
                    if (window.location.pathname !== `/comate/me/`) {
                        navigate('/comate/me/review', {replace: true});
                    }

                    setUserType('me');
                    setTargetMemNo(current.memNo);
                } else {
                    setUserType('user');
                    setTargetMemNo(memNo);
                }
            } catch (error) {
                console.error('로그인 유저 정보 불러오기 실패: ', error);
            }
        }

        initUser();
    }, [memNo]);

    /* 회원 기본정보 조회 */
    useEffect(() => {
        if (!targetMemNo) return;

        const loadProfile = async () => {
            setLoading(true);
            try {
                const data = await getProfile(targetMemNo);
                setMember(data);
                console.log('프로필 정보 ', data);
                // setIsFollowing(data.isFollowing || false); 
            } catch (error) {
                console.error(error);
                alert("회원 정보를 불러오는 중 오류가 발생했습니다. ");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [targetMemNo]);

    /* 탭별 데이터 조회 */
    useEffect(() => {
        if (!targetMemNo) return;

        const loadTabData = async() => {
            try {
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

        loadTabData();
    }, [activeTab, targetMemNo]);

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        if (userType === 'me') {
            navigate(`/comate/me/${tabName}`);
        } else {
            navigate(`/comate/user/${targetMemNo}/${tabName}`);
        }
    };

    /* URL 파라미터 탭 변경 감지 */
    useEffect(() => {
        if (tab && tab !== activeTab) setActiveTab(tab);
    }, [tab]);

    /* 팔로우/언팔로우 버튼 클릭 */
    const handleFollowClick = async () => {
        try {
            if (!member) return;
            
            if (following) {
                // await unfollow(currentMemNo, targetMemNo);
                setFollowing(false);
            } else {
                // await followerList(currentMemNo, targetMemNo);
                setFollowing(true);
            }
        } catch (error) {
            console.error(error);
            alert("팔로우/언팔로우 처리 중 오류가 발생했습니다.");
        }
    };


    if (loading || !member) return <div>로딩중...</div>;

    return (
        <div className="comate_wrapper">
            <ComateFullProfile
                nickname={member.memNickname}
                // skinTypes={member.skinTypes}
                likes={member.likedCount}
                followers={member.followerCount}
                following={member.followingCount}
                onFollowClick={handleFollowClick}
                onTabClick={handleTabClick}
                isMine = {isMine}
                isFollowing={member.following}
            />
            <ComateContent 
                activeTab={activeTab}
                reviewList={reviewList}
                likeList={likeList}
                followerList={followerList}
                followingList={followingList}
                loginUserNo={loginUser?.memNo}
            />
        </div>
    );   
}

export default Comate;
