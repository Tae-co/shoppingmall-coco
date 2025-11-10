import { useState } from "react";

function useTag (ptags,ntags) {

    const [ptagsClicked, setPtagsClicked] = useState(Array(ptags.length).fill(false));
    const [ntagsClicked, setNtagsClicked] = useState(Array(ntags.length).fill(false));
    const [pWarnMsg, pSetWarnMsg] = useState("");
    const [nWarnMsg, nSetWarnMsg] = useState("");

    const [ptagArr, setPtagArr] = useState([]);
    const [ntagArr, setNtagArr] = useState([]);

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

    return {
        ptagsClicked,
        ntagsClicked,
        pWarnMsg,
        nWarnMsg,
        ptoggleActive,
        ntoggleActive,
        setPtagsClicked,
        setNtagsClicked,
        setPtagArr,
        setNtagArr,
        ptagArr,
        ntagArr

    }
}

export default useTag;