import react, { useState } from "react";
import greyStar from '../img/greyStar.svg'
import yellowStar from '../img/yellowStar.svg'
import '../css/review.css'
function Review() {

    const [clicked, setClicked] = useState([false, false, false, false, false]);
    const starArray = [1, 2, 3, 4, 5];

    const [starTotal, setStar] = useState(0); // 별 점수 초기 상태

    const starScore = index => {
        let stars = [...starArray];

        for (let i = 0; i < 5; i++) {
            stars[i] = i <= index ? true : false;
        }

        setClicked(stars);


        let total = index + 1;

        console.log(total);
        setStar(total);
    }

    const ptags = ["보습력이 좋아요", "향이 좋아요", "발림성 좋아요"
        , "흡수가 빨라요", "끈적임 없어요", "피부 진정", "화이트닝 효과"
        , "주름 개선", "모공 케어", "민감성 피부 OK", "가성비 좋아요"
    ]

    const ntags = ["보습력이 부족해요", "향이 별로예요", "발림성 안 좋아요"
        , "흡수가 느려요", "끈적여요", "자극이 있어요", "효과 없어요"
        , "피부 트러블", "가격이 비싸요", "용량이 적어요", "제품이 변질됐어요"
    ]


    const [btnClicked, setBtnClicked] = useState(false);

    const clickedBtn = () => {
        setBtnClicked(!btnClicked);
        
    }


    return (
        <div>
            <div>
                <h1>리뷰 작성</h1>
            </div>

            <div>
                <h4>제품을 사용해보신 경험을 공유해주세요</h4>
            </div>

            <div>
                {/* 별을 누를 때 마다 노란 색으로 채워야 됨, 별이 얼마나 채워졌는지 확인해야함 */}
                <h5>별점을 선택해주세요.</h5>
                <div>
                    {starArray.map((stars, i) => (
                        <img
                            key={i}
                            onClick={() => starScore(i)}
                            src={clicked[i] ? yellowStar : greyStar}
                        />
                    ))}
                    별점 {starTotal}
                </div>

                <div>
                    <h5>어떤 점이 좋았나요? (복수 선택가능)</h5>
                </div>
                {/* 버튼 형식의 태그  */}
                <div>
                    {ptags.map((tags, i) => (
                        <button key={i} value={tags} onClick={clickedBtn}>{tags}</button>
                    ))}
                </div>
                <div>
                    <h5>어떤 점이 아쉬웠나요? (복수 선택가능)</h5>
                </div>
                {/* 버튼 형식의 태그  */}
                <div> {ntags.map((tags, i) => (
                    <button key={i} value={tags}>{tags}</button>
                ))} </div>
            </div>

            <div>
                <label htmlFor="{postText}">
                    <h5>리뷰를 작성해주세요</h5>
                </label>
                <div className=""><textarea className="textarea" id="postText" rows={40} cols={100} /></div>
            </div>

            <div>
                {/* 파일선택 버튼 바꾸기  */}
                <h5>사진 및 동영상 첨부(최대10개)</h5>
                <input type="file"></input>
            </div>

            <div>
                <h5>이미지:JPG,PNG,GIF / 동영상: MP4, MOV</h5>
            </div>

            <div>
                {/* 취소 및 리뷰등록 버튼 바꾸기  */}
                {/* 취소 선택시 상품 페이지로 */}
                {/* 리뷰 등록 선택시 리뷰 등록 후 상품 페이지로 */}
                <button>취소</button>
                <button>리뷰등록</button>
            </div>

        </div>
    )
}

export default Review;