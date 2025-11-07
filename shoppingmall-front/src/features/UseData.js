import { useState, useEffect } from "react";

function useData(setText, setRating, ptags, setPtagsClicked, ntags, setNtagsClicked, setPreviewFiles, setPtagArr, setNtagArr) {
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setLoading(true);

        // const response = await axios.get("");
        // console.log(response.data);

        const data = {
            starRaing: 4,
            text: "test 데이터 입니다.",
            goodTags: ["보습력이 좋아요", "향이 좋아요", "발림성 좋아요", "민감성 피부 OK"],
            badTags: ["가격이 비싸요", "용량이 적어요", "보습력이 부족해요", "끈적여요"],
            imageURLs: ["https://placehold.co/100x100/AAB/FFF?text=Img1", "https://placehold.co/100x100/BAA/FFF?text=Img2"]
        }
        // 별 점수 데이터
        setText(data.text);
        setRating(data.starRaing);

        const newPtagClicked = ptags.map((tag) => {
            return data.goodTags.includes(tag);
        });

        setPtagsClicked(newPtagClicked);


        const newNtagClicked = ntags.map((tag) => {
            return data.badTags.includes(tag);
        })
        setNtagsClicked(newNtagClicked);

        setLoading(false);

        if (data.imageURLs && data.imageURLs.length > 0) {
            const loadedImages = data.imageURLs.map(url => ({
                id: crypto.randomUUID(),
                url: url,
                file: null
            }));

            setPreviewFiles(loadedImages);
        }

        const getPtagData = ptags.filter((tag) => {
            return data.goodTags.includes(tag);
        })
        setPtagArr(getPtagData);

        const getNtagData = ntags.filter((tag) => {
            return data.badTags.includes(tag);
        })
        setNtagArr(getNtagData);

    }



    return {
        loadData,

    }

}

export default useData;