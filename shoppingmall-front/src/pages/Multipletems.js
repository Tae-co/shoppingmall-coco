import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../css/MultipleItems.css';

import ProductCard from '../components/ProductCard';
import sampleImg from '../images/sample_img.png'; // 임시 상품 이미지

function MultipleItems() {
    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true
    };

    // 인기 상품 데이터 (임시)
    const products = [
        { id: 1, name: "비타민 크림", price: 23000, img: sampleImg, star_avg: 4.5, reviewCount: 10},
        { id: 2, name: "모이스처 로션", price: 18000, img: sampleImg, star_avg: 4.0, reviewCount: 385},
        { id: 3, name: "딥 클렌징 폼", price: 15000, img: sampleImg, star_avg: 3.0, reviewCount: 300},
        { id: 4, name: "선크림 SPF50", price: 21000, img: sampleImg, star_avg: 2.5, reviewCount: 5},
        { id: 5, name: "선크림 SPF100", price: 23000, img: sampleImg, star_avg: 4.8, reviewCount: 100}
    ];

    // 장바구니 추가 버튼 (임시)
    const handleAddToCart = (product) => {
        console.log(`${product.name} 장바구니 추가`);
    };

    return (
        <div className="slider-container">
        <Slider {...settings}>
            {products.map((p) => (
                <div key={p.id}>
                    <ProductCard
                        name={p.name}
                        price={p.price}
                        image={p.img}
                        star_avg={p.star_avg}
                        reviewCount={p.reviewCount}
                        
                        onClick={() => console.log(`${p.name}`)} // 상품 클릭-> 상세페이지로 이동 경로 추가 예정
                        onAddToCart={() => handleAddToCart(p)} // 장바구니 클릭-> 장바구니에 상품 추가 로직 추가 예정
                    />
                </div>
            ))}
        </Slider>
        </div>
    );
}

export default MultipleItems;