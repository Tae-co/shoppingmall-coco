import React from "react";

import '../css/ProductCard.css';

import starIcon from '../images/review_rate_icon_star.png';

const ProductCard = ({ name, price, image, star_avg, reviewCount, onClick, onAddToCart }) => {
    return (
        <div className="product_card">
            <div className="to_product_detail" onClick={onClick}>
                <img src={image} alt="img_error" className="product_image" />
                <div className="product_info">
                  <div className="product_name"><span>{name}</span></div>
                  <div className="product_reviewInfo">
                    <img src={starIcon} alt="star_icon_error" className="star_icon" />
                    <span className="product_star_avg">{star_avg} </span>
                    <span className="product_reviewCount">({reviewCount})</span>
                  </div>
                  <div className="product_price">{price}원</div>
              </div>
            </div>

            {/* 장바구니 추가 버튼 */}
            {/* 클릭 시 onAddToCart 함수 호출 */}
            <div className="btn_add_cart" onClick={onAddToCart}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="16" height="16">
                <path fill="#FFFFFF" fillRule="evenodd" d="M16.192 5.2h3.267a1 1 0 0 1 .998.938l.916 14.837a.4.4 0 0 1-.399.425H3.025a.4.4 0 0 1-.4-.425l.917-14.837A1 1 0 0 1 4.54 5.2h3.267a4.251 4.251 0 0 1 8.385 0ZM7.75 6.7H5.01l-.815 13.2h15.61l-.816-13.2h-2.74v2.7h-1.5V6.7h-5.5v2.7h-1.5V6.7Zm1.59-1.5h5.32a2.751 2.751 0 0 0-5.32 0Z" clipRule="evenodd"></path>
              </svg>
              &nbsp;&nbsp;장바구니
            </div>
        </div>
    );
  };

  export default ProductCard;