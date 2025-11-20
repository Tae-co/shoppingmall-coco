function SimilarSkinReview({ stats }) {

    if (!stats) return null;

    return (
        <div className="similar-review-box">
            <h3>
                🧴 <strong>{stats.skinType}</strong> 타입 고객님들의 선택!
            </h3>
            <p>
                {stats.skinType} 타입 사용자 <strong>{stats.topTags[0].percentage}%</strong>가 
                <span className="highlight"> #{stats.topTags[0].tagName}</span> 태그를 선택했어요.
            </p>
            {/* 추가 태그 표시 */}
            <div className="tag-chips">
                {stats.topTags.map(tag => (
                    <span key={tag.tagName}>#{tag.tagName} ({tag.percentage}%)</span>
                ))}
            </div>
        </div>
    );
}

export default SimilarSkinReview;