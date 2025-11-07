
function useSubmut (ptags,ptagsClicked,ntags,ntagsClicked,text,starTotal,previewFiles) {
    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        const positiveTags = ptags.filter((tag, index) => ptagsClicked[index]);
        const negativeTags = ntags.filter((tag, index) => ntagsClicked[index]);

        if (text.length < 1000) {
            window.alert("1000자 이상 작성해주세요!");
        } else if (starTotal < 1) {
            window.alert("별점을 눌러주세요!");
        } else if (starTotal < 3 && negativeTags == "" ){
            window.alert("필수 태그를 눌러주세요!")
        } else if (positiveTags == "") {
            window.alert("태그를 눌러주세요!")
        } else {
            formData.append("starRating", starTotal);

            formData.append("reviewText", text);
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
        }
    };

    return{
        handleSubmit
    }
}

export default useSubmut;