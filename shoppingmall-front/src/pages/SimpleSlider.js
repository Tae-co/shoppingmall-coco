import React from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../css/SimpleSlider.css';

function SimpleSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        autoplay: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerPadding: '20px'
    };
    return (
        <div className="slider_container">
            <Slider {...settings}>
                <div>
                    <div className="slide page1"></div>        
                </div>
                <div>
                    <div className="slide page2"></div> 
                </div>
                <div>
                    <div className="slide page3"></div> 
                </div>
                <div>
                    <div className="slide page4"></div> 
                </div>
            </Slider>
        </div>
    );
}

export default SimpleSlider;