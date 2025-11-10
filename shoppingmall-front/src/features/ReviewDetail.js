import edit from '../images/edit.svg'
import del from '../images/delete.svg'
import { useNavigate } from 'react-router-dom'
import UseStarRating from '../features/UseStarRating.js'
import UseTag from '../features/UseTag.js'
import usefile from '../features/UseFile.js'
import UseSubmut from '../features/UseSubmit.js'
import UseData from '../features/UseData.js'
import { useState, useEffect } from 'react'
import greyStar from '../images/greyStar.svg'
import yellowStar from '../images/yellowStar.svg'
import detailIcon from '../images/detailIcon.svg'
import love from '../images/love.png'
import '../css/ReviewDetail.css'
function ReviewDetail({reviewData, onDelete}) {
    const navigate = useNavigate();

    const ptags = ["보습력이 좋아요", "향이 좋아요", "발림성 좋아요"
        , "흡수가 빨라요", "끈적임 없어요", "피부 진정", "화이트닝 효과"
        , "주름 개선", "모공 케어", "민감성 피부 OK", "가성비 좋아요"
    ]

    const ntags = ["보습력이 부족해요", "향이 별로예요", "발림성 안 좋아요"
        , "흡수가 느려요", "끈적여요", "자극이 있어요", "효과 없어요"
        , "피부 트러블", "가격이 비싸요", "용량이 적어요", "제품이 변질됐어요"
    ]

     const {
        reviewNo,
        userName,
        date,
        starRating,
        text,
        goodTags,
        badTags,
        images
    } = reviewData;

    const [like, setlike] = useState(0);
    

    const { starTotal, clicked, starScore, starArray, setRating } = UseStarRating(0);
    const { ptagsClicked, ntagsClicked, pWarnMsg, nWarnMsg, ptoggleActive, ntoggleActive, setPtagsClicked, setNtagsClicked, ptagArr, ntagArr, setPtagArr, setNtagArr } = UseTag(ptags, ntags);
    const { previewFiles, setPreviewFiles, handleDelete, handleAddImageClick, handleFileChange, ref, fileError } = usefile();

    // 자신이 리뷰한 내용에만 수정 삭제 아이콘 보이기 

    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        setRating(starRating);
    }, []);

    const updateReview = () => {
        navigate("/update-reviews/${reviewNo}");
    }

    const deleteReview = () => {
        const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
        if (confirmDelete) {
            // (TODO: 실제 API DELETE /api/reviews/{reviewNo} 호출)
            console.log("삭제 API 호출:", reviewNo);
            
            // ⬇️ [FIX] navigate(0) 대신, 부모(ProductReviews)로부터
            // 받은 onDelete 함수를 호출하여 '상태'를 업데이트합니다.
            onDelete(reviewNo); 
        }
    }

    const addLike = () => {
        let addLove = like + 1;
        setlike(addLove);
    }

    return (
        
            <div className="reviewBox">
                <div className="headBox">
                    <div className="name-star">
                        <span className='username'>{userName}</span>
                        <div className='stars'>
                            {starArray.map((stars, i) => (
                                <img
                                    key={i}
                                    src={clicked[i] ? yellowStar : greyStar}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="date-edit">
                        <span className='date'>{date}</span>
                        <img className="icon-btn" src={edit} onClick={updateReview} />
                        <img className="icon-btn" src={del} onClick={deleteReview} />
                    </div>
                </div>
                <div className='imgBox'>
                    {images && images.map((imgUrl, i) => (
                    <img className="tag" key={i} src={imgUrl} alt="리뷰 이미지"/>
                ))}
                </div>
                <div className="tagBox">
                    {goodTags && goodTags.map((ptag, i) => (
                    <span key={`p-${i}`}>{ptag}</span>
                ))}
                {badTags && badTags.map((ntag, i) => (
                    <span key={`n-${i}`}>{ntag}</span>
                ))}
                </div>
                <div className="textBox">
                    <p className={isExpanded ? 'expanded' : 'clamped'}>
                        {text}
                    </p>
                </div>
                <div 
                    className={`detail-box ${isExpanded ? 'expanded' : ''}`}
                    onClick={toggleExpand}
                >
                    <img src={detailIcon} alt={isExpanded ? '접기' : '더보기'}/>
                    <span>{isExpanded ? '간략히 보기' : '더보기'}</span>
                </div>
                <div className='like'>
                    <img src={love} onClick={addLike}/>
                    <span>{like}</span>
                </div>
            </div>
        
    );
}

export default ReviewDetail;