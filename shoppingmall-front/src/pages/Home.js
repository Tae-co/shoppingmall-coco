import React from 'react';
import {Link, useNavigate} from 'react-router-dom';

import skincareImg from '../images/category/category_skincare.png';
import makeupImg from '../images/category/category_makeup.png';
import bodycareImg from '../images/category/category_bodycare.png'
import hommeImg from '../images/category/category_homme.png';

import '../css/Home.css';

import SimpleSlider from './SimpleSlider'; // 메인배너 슬라이더 컴포넌트
import BestSeller from './BestSeller'; // 인기상품 슬라이더 컴포넌트
import ComateCardList from './ComateCardList';

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
                            <div className="clickable_area" onClick={() => navigateToCategory('bodycare')}>
                            <img src={bodycareImg} alt="category_img"/><div>BODY CARE</div>
                            </div>
                        </li>
                        <li className="category_item">
                            <div className="clickable_area" onClick={() => navigateToCategory('homme')}>
                            <img src={hommeImg} alt="category_img"/><div>HOMME</div>
                            </div>
                        </li>
                    </ul>
                </div>
                {/* 인기 상품 영역 */}
                <div className="popular_product_wrapper">
                    <div className="popular_title">
                        <h2>BEST SELLER</h2>
                        <div className="sub_title">COCO의 베스트 아이템을 만나보세요</div>
                    </div>
                    <div className="popular_list">
                    <BestSeller />   
                    </div>
                </div>
                {/* CO-MATE 추천 영역 */}
                <div className="comate_recommend_wrapper">
                    <div className="comate_title">
                        <h2>CO-MATE</h2>
                        <div className="sub_title_wrapper">
                            <div className="sub_title">신뢰할 수 있는 뷰티 전문가들을 팔로우하세요</div>
                            <div className="sub_title"><Link to="/comate" className="more">더보기</Link></div>
                        </div>
                    </div>
                    <div className="comate_list">
                    {/* comate 관련 컴포넌트 추가 예정 */}
                    <ComateCardList/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;