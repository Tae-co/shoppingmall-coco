import react, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import greyStar from '../images/greyStar.svg'
import yellowStar from '../images/yellowStar.svg'
import addImg from '../images/addImg.svg'
import '../css/review.css'
function Review() {

    const [text, setText] = useState(""); // 리뷰 텍스트를 위한 state

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

    // 별 개수
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
    const [previewFiles, setPreviewFiles] = useState([]); // {id, url} 객체 배열
    const [fileError, setFileError] = useState("");

    const processFile = (file) => {

        return new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = (event) => {
                resolve({
                    id: crypto.randomUUID(), // 고유 ID
                    url: event.target.result, // 미리보기 URL
                    file: file
                });
            };
            // 파일이 성공적으로 입력이 되었을 때 id, url, file를 만든다.

            // 에러가 발생시 error 메시지 만든다.
            reader.onerror = (error) => reject(error);

            //파일을 읽는 작업 실행 
            reader.readAsDataURL(file);


        });
    };

    const handleFileChange = async (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length === 0) return;

        const currentCount = previewFiles.length;
        const remainingSlots = 5 - currentCount;

        if (newFiles.length > remainingSlots) {
            setFileError(`최대 5개까지만 첨부할 수 있습니다. ${remainingSlots}개만 추가됩니다.`);
            newFiles.splice(remainingSlots);
        } else {
            setFileError("");
        }
        const newFileObjects = await Promise.all(newFiles.map(processFile));
        setPreviewFiles(prevFiles => [...prevFiles, ...newFileObjects]);

        e.target.value = null;
    };

    const handleDelete = (idToDelete) => {
        setPreviewFiles(prevFiles =>
            prevFiles.filter(file => file.id !== idToDelete)
        );
        if (previewFiles.length - 1 < 5) {
            setFileError("");
        }
    };

    const handleAddImageClick = () => {
        if (previewFiles.length < 5) {
            setFileError("");
            ref.current.click();
        } else {
            setFileError("최대 5개까지만 첨부할 수 있습니다.");
        }
    };


    const handleSubmit = (event) => {

        event.preventDefault();
        const formData = new FormData();

        formData.append("starRating", starTotal);
        formData.append("reviewText", text);

        const positiveTags = ptags.filter((tag, index) => ptagsClicked[index]);
        const negativeTags = ntags.filter((tag, index) => ntagsClicked[index]);

        formData.append("goodTags", JSON.stringify(positiveTags));
        formData.append("badTags", JSON.stringify(negativeTags));

        previewFiles.forEach((pf, index) => {
            formData.append(`images`, pf.file);
        });

        console.log("--- 폼 제출 데이터 ---");
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }
        console.log("----------------------");

        alert("리뷰 등록 로직이 호출되었습니다. (콘솔을 확인하세요)");
    };

    return (
        <div className="reviewBox">
            <div className="reviewMain">
                <form className="reviewForm" onSubmit={handleSubmit}>
                    <div className="title">
                        <h1>리뷰 작성</h1>
                        <h4>제품을 사용해보신 경험을 공유해주세요</h4>
                    </div>

                    <div className="starContainer">
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
                                <button type="button" className={"tagBtn" + (ptagsClicked[i] ? "active" : " ")} key={i} value={tags} onClick={() => ptoggleActive(i)}>{tags}</button>
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
                            <button type="button" className={"tagBtn" + (ntagsClicked[i] ? "active" : " ")} key={i} value={tags} onClick={() => ntoggleActive(i)}>{tags}</button>
                        ))} </div>
                    </div>

                    <div className="textBox">
                        {/* 최소 글자 수 못 넘겼을 때 나오는 글 표시 필요 */}
                        <label htmlFor="postText">
                            <h5>리뷰를 작성해주세요</h5>
                        </label>
                        <div>
                            <textarea
                                className="textarea"
                                id="postText"
                                rows={30}
                                placeholder="자세한 리뷰는 다른 분들께 큰 도움이 됩니다."
                                value={text}
                                minLength={1000}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="fileBox">
                        <div className="scrollable-container">
                            {/* 이미지 미리보기 컴포넌트 리스트 */}
                            {previewFiles.map(preview => (
                                <div key={preview.id} className="preview-component">
                                    <img
                                        src={preview.url}
                                        alt="미리보기"
                                        className="preview-image"
                                    />
                                    {/* 삭제 버튼 */}
                                    <button type="button"
                                        onClick={() => handleDelete(preview.id)}
                                        className="delete-button"
                                    >
                                        X
                                    </button>
                                </div>
                            ))}

                            {/* 이미지 추가 버튼 (5개 미만일 때만 보임) */}
                            {previewFiles.length < 5 && (
                                <div className="addImgBtn" onClick={handleAddImageClick}>
                                    <span>사진 추가 ({previewFiles.length}/5)</span>
                                    <img src={addImg} />
                                </div>
                            )}
                        </div>

                        <input
                            hidden
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={ref}
                        />

                        {fileError && <div className="fileError">{fileError}</div>}

                        <div className="fileInfo" >
                            <h5>이미지:JPG,PNG,GIF</h5>
                        </div>

                    </div>

                    <div className="buttonBox">
                        {/* 취소 및 리뷰등록 버튼 바꾸기  */}
                        {/* 취소 선택시 상품 페이지로 */}
                        {/* 리뷰 등록 선택시 리뷰 등록 후 상품 페이지로 */}
                        <Link path="/coco/products/{productId}"><button>취소</button></Link>
                        <button type="submit">리뷰등록</button>
                    </div>
                </form >
            </div>
        </div >
    )
}

export default Review;