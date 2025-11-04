import react, { useState, useRef, use } from "react";
import greyStar from '../images/greyStar.svg'
import yellowStar from '../images/yellowStar.svg'
import addImg from '../images/addImg.svg'
import '../css/review.css'
function Review() {

    const ptags = ["보습력이 좋아요", "향이 좋아요", "발림성 좋아요"
        , "흡수가 빨라요", "끈적임 없어요", "피부 진정", "화이트닝 효과"
        , "주름 개선", "모공 케어", "민감성 피부 OK", "가성비 좋아요"
    ]

    const ntags = ["보습력이 부족해요", "향이 별로예요", "발림성 안 좋아요"
        , "흡수가 느려요", "끈적여요", "자극이 있어요", "효과 없어요"
        , "피부 트러블", "가격이 비싸요", "용량이 적어요", "제품이 변질됐어요"
    ]

    const [clicked, setClicked] = useState([false, false, false, false, false]); // 별 초기 상태
    const starArray = [1, 2, 3, 4, 5]; // 별 인덱스 
    const [starTotal, setStar] = useState(0); // 별 점수 초기 상태

    // 별 체크 및 별 갯수
    const starScore = index => {
        let stars = [...starArray];

        for (let i = 0; i < 5; i++) {
            stars[i] = i <= index ? true : false;
        }

        setClicked(stars);

        let total = index + 1;
        setStar(total);
    }

    // 별 1~2개 일 떄 경고 알림

    const warnStarTags = (starTotal) => {
        return 0 < starTotal && starTotal <= 2 ? "별점이 낮을 경우, 아쉬운 점을 최소 1개 이상 선택해주세요." : " ";
    }

    const [ptagsClicked, setPtagsClicked] = useState(Array(ptags.length).fill(false));
    const [ntagsClicked, setNtagsClicked] = useState(Array(ntags.length).fill(false));
    const [pWarnMsg, pSetWarnMsg] = useState("");
    const [nWarnMsg, nSetWarnMsg] = useState("");

    const ptoggleActive = (indexTogle) => {

        setPtagsClicked((prevStates) => {

            const currentState = prevStates.filter(Boolean).length;
            const isAdding = !prevStates[indexTogle];

            if (isAdding && currentState >= 4) {
                pSetWarnMsg("최대 4개 까지 선택할 수 있습니다.");
                return prevStates;
            }

            pSetWarnMsg("");
            return prevStates.map((currentState, index) => {
                return indexTogle == index ? !currentState : currentState;
            })
        })
    };

    const ntoggleActive = (indexTogle) => {
        setNtagsClicked((prevStates) => {
            const currentState = prevStates.filter(Boolean).length; // true 개수
            const isAdding = !prevStates[indexTogle]// isAdding이 true면 추가 , false면 취소 

            if (isAdding && currentState >= 4) {
                nSetWarnMsg("최대 4개 까지 선택할 수 있습니다.");
                return prevStates;
            }
            nSetWarnMsg("");
            return prevStates.map((currentState, index) => {
                return indexTogle == index ? !currentState : currentState;
            })
        })
    };

    const ref = useRef(null);
    const [fileReader, setFileReader] = useState();

    const encodeFile = (imgFile) => {
        const reader = new FileReader();

        if (!imgFile) {
            return;
        }

        reader.readAsDataURL(imgFile);

        return new Promise((resolve) => {
            reader.onload = () => {
                const result = reader.result;

                setFileReader(result);
            }
        })
    }

    const onFileReaderChange = (e) => {
        const { files } = e.target;

        if (!files || !files[0]) return;

        const uploadImage = files[0];
        encodeFile(uploadImage);
    }

    const onClick = () => {
        ref.current.click();
    }


    return (
        <div className="reviewBox">
            <div calssName="reviewMain">
                <div className="reviewForm">
                    <div className="title">
                        <h1>리뷰 작성</h1>
                        <h4>제품을 사용해보신 경험을 공유해주세요</h4>
                    </div>

                    <div calssName="starContainer">
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
                    </div>

                    <div className="tagBox">
                        <h5 className="tagsTitle">어떤 점이 좋았나요? (복수 선택가능)</h5>
                        <br /><div className="warnText">{pWarnMsg}</div>
                        {/* 버튼 형식의 태그  */}
                        <div className="tagContainer">
                            {ptags.map((tags, i) => (
                                <button className={"tagBtn" + (ptagsClicked[i] ? "active" : " ")} key={i} value={tags} onClick={() => ptoggleActive(i)}>{tags}</button>
                            ))}
                        </div>
                    </div>

                    <div className="tagBox">
                        {/* 별점이 1~2개 일 때 필수로 선택해야 한다는 문구 표시 */}
                        <h5 className="tagsTitle">어떤 점이 아쉬웠나요? (복수 선택가능)</h5>
                        <br /><div className="warnText">{nWarnMsg}&nbsp;&nbsp;</div>
                        <div className="warnText">{warnStarTags(starTotal)}</div>


                        {/* 버튼 형식의 태그  */}
                        <div className="tagContainer"> {ntags.map((tags, i) => (
                            <button className={"tagBtn" + (ntagsClicked[i] ? "active" : " ")} key={i} value={tags} onClick={() => ntoggleActive(i)}>{tags}</button>
                        ))} </div>
                    </div>

                    <div className="textBox">
                        {/* 최소 글자 수 못 넘겼을 때 나오는 글 표시 필요 */}
                        <label htmlFor="{postText}">
                            <h5>리뷰를 작성해주세요</h5>
                        </label>
                        <div>
                            <textarea
                                className="textarea" id="postText" rows={40} cols={100} />
                        </div>
                        {/* 최소글자 입력 경고 */}
                    </div>

                    <div className="fileBox">
                        {/* 파일선택 버튼 바꾸기  */}
                        <h5>사진 및 동영상 첨부(최대10개)</h5>

                        <div className="viewBox">
                            {fileReader ? (<img src={fileReader} alt="이미지 미리보기" />) : ("이미지 미리보기")}
                        </div>

                        <button onClick={onClick}>
                            <input hidden type="file" id="image-uplaod" accept="image/*" onChange={onFileReaderChange} ref={ref} />
                        </button>

                        <div className="fileInfo" >
                            <h5>이미지:JPG,PNG,GIF / 동영상: MP4, MOV</h5>
                        </div>

                    </div>

                    <div className="buttonBox">
                        {/* 취소 및 리뷰등록 버튼 바꾸기  */}
                        {/* 취소 선택시 상품 페이지로 */}
                        {/* 리뷰 등록 선택시 리뷰 등록 후 상품 페이지로 */}
                        <button>취소</button>
                        <button>리뷰등록</button>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Review;