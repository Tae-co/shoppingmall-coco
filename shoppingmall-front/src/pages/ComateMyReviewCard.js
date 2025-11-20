import React from 'react';

import '../css/ComateReviewCard.css';

import sampleImg_product from '../images/sampleImg_product.png'; // 임시 상품 이미지
import starIcon from '../images/review_rate_icon_star.png';

const ComateReviewCard = ({
    productName, productOption, 
    createdAt, rating, content, tags = [], likeCount = 0,
    authorName, author_MemNo // 작성자 관련 (like 리뷰일때만 사용)
}) => {
    return (
        <div className="comate_review_wrapper">
            <div className="product_info">
                <img src={sampleImg_product} alt={productName} className="product_img comate"/>
                <div className="text_info">
                    <div className="product_name">{productName}</div>
                    <div className="product_option">{productOption}</div>
                </div>
            </div>
            <div className="review_info">
                <div className="review_header">
                    <div className="review_star">
                        <img src={starIcon} alt="star" />
                        <img src={starIcon} alt="star" />
                        <img src={starIcon} alt="star" />
                        <img src={starIcon} alt="star" />
                        <img src={starIcon} alt="star" />
                    </div>
                    <div className="review_meta">작성일자 {createdAt}</div>
                </div>
                <div className="review_tags">{tags.map(tag => <span key={tag}>{tag}</span>)}</div>
                <div className="review_content">{content}</div>
                <div className="review_like_wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="100%" viewBox="0 0 20 20" fill="none" stroke="#999" strokeWidth="2" >
                        <path d="M9.79493 16.3061C9.91046 16.4154 10.0895 16.4154 10.2051 16.3061C11.1045 15.4553 14.7235 12.0265 16.25 10.5C16.8895 9.85325 17.5 8.75 17.5 7.5C17.5 5.34156 15.8342 3.5 13.75 3.5C11.9105 3.5 11 4.99545 10 6.25C9 4.99545 8.08947 3.5 6.25 3.5C4.16579 3.5 2.5 5.34156 2.5 7.5C2.5 8.75 3.11053 9.85325 3.75 10.5C5.27651 12.0265 8.89549 15.4553 9.79493 16.3061Z" stroke-width="1.4" stroke-miterlimit="10"></path>
                    </svg>
                    <div>좋아요 {likeCount}</div>
                </div>
            </div>
        </div>
    );   
}

export default ComateReviewCard;
