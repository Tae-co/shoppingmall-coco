const API_BASE_URL = 'http://localhost:8080/api';

/* 메인 화면용 - 전체 회원 목록 조회 */
export const getAllComates = async() => {
    const response = await fetch(`${API_BASE_URL}/comate/users`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    });

    if (!response.ok) throw new Error("회원 목록을 불러오지 못했습니다.");
    return response.json();
};

/* 프로필 정보 조회 */
export const getProfile = async (memNo) => {
    const response = await fetch(`${API_BASE_URL}/comate/user/${memNo}`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    });
    if (!response.ok) throw new Error('회원정보 조회 실패');
    return response.json();
};

/* 사용자 작성 리뷰 목록 */
export const getReviewList = async (memNo) => {
    const response = await fetch(`${API_BASE_URL}/comate/review/${memNo}`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    });
    if (!response.ok) throw new Error("작성한 리뷰 조회 실패");
    return response.json();
}

/* 사용자가 좋아요 누른 리뷰 목록 */
export const getLikedList = async (memNo) => {
    const response = await fetch(`${API_BASE_URL}/comate/like/${memNo}`, {
        method : "GET",
        headers : {
            "Content-Type" : "application/json"
        }
    });
    if (!response.ok) throw new Error("좋아요한 리뷰 조회 실패");
    return response.json();
}

/* 팔로워 목록 조회 */
export const getFollowerList = async (memNo) => {
    const response = await fetch(`${API_BASE_URL}/comate/follow/followers/${memNo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) throw new Error('팔로워 목록 조회 실패');
    return response.json();
}

/* 팔로잉 목록 조회 */
export const getFollowingList = async (memNo) => {
    const response = await fetch(`${API_BASE_URL}/comate/follow/followings/${memNo}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) throw new Error('팔로잉 목록 조회 실패');
    return response.json();
};

// 팔로우
export const follow = async (currentMemNo, targetMemNo) => {
    const response = await fetch(`${API_BASE_URL}/comate/follow/${targetMemNo}?currentMemNo=${currentMemNo}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentMemNo })
    });
    if (!response.ok) throw new Error('팔로우 실패');
    return response.text();
};

// 언팔로우
export const unfollow = async (currentMemNo, targetMemNo) => {
    const response = await fetch(`${API_BASE_URL}/comate/unfollow/${targetMemNo}?currentMemNo=${currentMemNo}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ currentMemNo })
    });
    if (!response.ok) throw new Error('언팔로우 실패');
    return response.text(); // "언팔로우 완료" 문자열 반환
};