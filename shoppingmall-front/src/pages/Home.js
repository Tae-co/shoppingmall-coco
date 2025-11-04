import React from 'react';
import {useNavigate} from 'react-router-dom';

import skincareImg from '../images/category/category_skincare.png';
import makeupImg from '../images/category/category_makeup.png';
import cleansingImg from '../images/category/category_cleansing.png';
import facialmaskImg from '../images/category/category_facialmask.png';

import '../css/Home.css';

import SimpleSlider from './SimpleSlider'; // 슬라이더 컴포넌트

const Home = () => {

    const navigate = useNavigate();

    // 카테고리 클릭-> 카테고리 페이지로 이동 (임시 경로)
    // 현재 path는 빈 문자열
    const navigateToCategory = (category) => {
        const path = '';
        navigate(path);
    };

    return (
        <div>
            {/* 슬라이더 배너 */}
            <SimpleSlider />
            <div className="home_content">
                {/* 카테고리 영역 */}
                <div className="category_wrapper">
                    <ul className="category_list">
                        <li className="category_item">
                            <div className="clickable_area" onClick={() => navigateToCategory('skincare')}>
                            <img src={skincareImg} alt="category_img"/><div>SKIN CARE</div>
                            </div>
                        </li>
                        <li className="category_item">
                            <div className="clickable_area" onClick={() => navigateToCategory('makeup')}>
                            <img src={makeupImg} alt="category_img"/><div>MAKE UP</div>
                            </div>
                        </li>
                        <li className="category_item">
                            <div className="clickable_area" onClick={() => navigateToCategory('cleansing')}>
                            <img src={cleansingImg} alt="category_img"/><div>CLEANSING</div>
                            </div>
                        </li>
                        <li className="category_item">
                            <div className="clickable_area" onClick={() => navigateToCategory('facialmask')}>
                            <img src={facialmaskImg} alt="category_img"/><div>FACIAL MASK</div>
                            </div>
                        </li>
                    </ul>
                </div>
                {/* 인기 상품 영역 */}
                <div className="popular_product_wrapper">
                    <h2 className="popular_title">인기 상품</h2>
                    <div className="popular_list">
                    {/* 인기 상품 카드 컴포넌트 추가 예정 */}

                    </div>
                </div>
                {/* CO-MATE 추천 영역 */}
                <div className="comate_recommend_wrapper">
                    <h2 className="comate_title">CO-MATE 추천</h2>
                    <div className="comate_list">
                    {/* 인기 상품 카드 컴포넌트 추가 예정 */}

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;