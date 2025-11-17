import React, {useState} from 'react';

import ComateReviewCard from './ComateReviewCard';
import ComateUserCard from './ComateUserCard';

const ComateContent = ({ 
    activeTab,
    reviewList = [],
    likeList = [],
    followerList = [],
    followingList = []
}) => {
    let title = null;
    let content = null;

    const showSortAndCount = activeTab === 'review' || activeTab === 'like';
    const count = activeTab === 'review' ? reviewList.length
            : activeTab === 'like' ? likeList.length
            : 0;
    
    const [sortOption, setSortOption] = useState('latest');

    switch(activeTab) {
        case 'review':
            title = "누적 리뷰";
            content = reviewList.map(item => <ComateReviewCard key={item.id} {...item} />);
            break;
        case 'like':
            title = "좋아요";
            content = likeList.map(item => <ComateReviewCard key={item.id} {...item} />);
            break;
        case 'follower':
            title = "팔로워";
            content = followerList.map(item => <ComateUserCard key={item.id} {...item} />);
            break;
        case 'following':
            title = "팔로잉";
            content = followingList.map(item => <ComateUserCard key={item.id} {...item} />);
            break;
        default:
            content = <div>데이터 없음</div>;
    }

    return (
        <div className="comate_content_wrapper">
            <div className="content_top">
                <div className="content_title_wrapper">
                    <div className="content_title">{title}</div>
                    {showSortAndCount && (
                    <div className="content_count">{count}</div>)}
                </div>
                {showSortAndCount && (
                <select
                    className="sort_selector"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                >
                    <option value="latest">최신순</option>
                    <option value="highRating">별점 높은순</option>
                    <option value="lowRating">별점 낮은순</option>
                </select>
                )}
            </div>
            {/* 리스트 영역 */}
            <div className="content_list">{content}</div>
        </div>
    
    );
};

export default ComateContent;
