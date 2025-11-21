import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../css/BestSeller.css';

import ProductCard from '../components/ProductCard';
import { fetchWithAuth, isLoggedIn, getStoredMember } from '../utils/api'; // 장바구니 기능용

// 영어 -> 한글 변환 맵
const skinTypeMap = {
    dry: '건성',
    oily: '지성',
    combination: '복합성',
    sensitive: '민감성',
    all: '모든 피부'
};

function MultipleItems() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        // 반응형 설정 (상품 개수가 적을 때 깨짐 방지)
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 3 }
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 2 }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1 }
            }
        ]
    };

    // 컴포넌트 로드 시 '인기 상품' 10개 가져오기
    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                // sort=popularity, size=10으로 요청
                const response = await fetch('http://localhost:8080/api/products?page=1&size=10&sort=popularity');
                if (!response.ok) throw new Error("데이터 로드 실패");

                const data = await response.json();
                const content = data.content || [];

                // 판매중지 상품은 아예 목록에서 제외
                const validProducts = content.filter(p => p.status !== '판매중지');

                setProducts(validProducts);

            } catch (error) {
                console.error("베스트 상품 로드 중 오류:", error);
            }
        };

        fetchBestSellers();
    }, []);

    // 상품 클릭 시 상세 페이지 이동
    const handleProductClick = (prdNo) => {
        navigate(`/products/${prdNo}`);
    };

    // 장바구니 담기 핸들러 (ProductListPage 로직 재사용)
    const handleAddToCart = async (e, product) => {
        e.stopPropagation(); // 부모 클릭 이벤트(상세 이동) 방지

        // 품절 체크
        if (product.status === '품절') {
            alert("현재 품절된 상품입니다.");
            return;
        }

        if (!isLoggedIn()) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }

        const member = getStoredMember();
        if (!product.defaultOptionNo) {
            alert('옵션을 선택해야 하는 상품입니다. 상세 페이지에서 담아주세요.');
            navigate(`/products/${product.prdNo}`);
            return;
        }

        try {
            const response = await fetchWithAuth('/coco/members/cart/items', {
                method: 'POST',
                body: JSON.stringify({
                    memNo: member.memNo,
                    optionNo: product.defaultOptionNo,
                    cartQty: 1
                })
            });

            if (response.ok) {
                if (window.confirm('장바구니에 담았습니다. \n장바구니로 이동하시겠습니까?')) {
                    navigate('/cart');
                }
            } else {
                alert('장바구니 담기에 실패했습니다.');
            }
        } catch (error) {
            console.error(error);
            alert('오류가 발생했습니다.');
        }
    };

    // 데이터가 없을 경우 처리
    if (products.length === 0) {
        return <div style={{ textAlign: 'center', padding: '50px', color: '#888' }}>등록된 베스트 상품이 없습니다.</div>;
    }

    return (
        <div className="slider-container">
            <Slider {...settings}>
                {products.map((p, index) => {
                    // 태그 한글 변환 로직
                    const koreanSkinTypes = p.skinTypes
                        ? p.skinTypes.map(type => skinTypeMap[type] || type)
                        : [];

                    // 품절 여부 확인
                    const isSoldOut = p.status === '품절';


                    return (
                        <div key={p.prdNo} style={{ padding: '10px', position: 'relative' }}> {/* 슬라이드 간 간격 조정 */}

                            {/* 랭킹 뱃지 표시 */}
                            <div style={{
                                position: 'absolute', top: '0', left: '20px', zIndex: 1,
                                background: 'black', color: 'white', width: '30px', height: '30px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                            }}>
                                {index + 1}
                            </div>

                            <ProductCard
                                name={p.prdName}
                                productSkinType={koreanSkinTypes} // 변환된 한글 태그 전달
                                price={p.prdPrice.toLocaleString()} // 천단위 콤마
                                image={p.imageUrl}
                                star_avg={p.averageRating}
                                reviewCount={p.reviewCount}

                                // 클릭 이벤트 연결
                                onClick={() => handleProductClick(p.prdNo)} // 상품 클릭-> 상세페이지로 이동 경로 추가
                                onAddToCart={(e) => handleAddToCart(e, p)} // 장바구니 클릭-> 장바구니에 상품 추가 로직 추가
                            />

                            {/* 품절 시 시각적 처리 */}
                            {isSoldOut && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                                    background: 'rgba(255,255,255,0.6)', pointerEvents: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'red', fontWeight: 'bold', fontSize: '1.2rem'
                                }}>
                                    SOLD OUT
                                </div>
                            )}
                        </div>
                    );
                })}
            </Slider>
        </div>
    );
}

export default MultipleItems;