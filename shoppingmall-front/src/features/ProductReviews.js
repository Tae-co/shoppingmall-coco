import { useState, useEffect } from "react";
import ReviewDetail from "./ReviewDetail";

function ProductReviews() {
    
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleDeleteReview = (reviewNoToDelete) => {
        // 실제로는 여기서 API DELETE 호출
        
        // 2. API 호출 성공 시, React '상태(state)'에서 해당 리뷰를 제거
        //    (filter를 사용해 reviewNoToDelete와 일치하지 않는 것만 남김)
        setReviews(currentReviews =>
            currentReviews.filter(review => review.reviewNo !== reviewNoToDelete)
        );
    };

    useEffect(() => {
        const fetchReviews = async () => {
            setLoading(true);
            try {
                
                await new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 로딩
                // const response = await axios.get('/api/products/1/reviews');
                // setReviews(response.data.reviews);

            } catch (error) {
                console.error("리뷰 목록을 불러오는데 실패했습니다:", error);
            }
            setLoading(false);
        };
        
        fetchReviews();
    }, []);

    if (loading) {
        return <div style={{padding: '20px', textAlign: 'center'}}>리뷰를 불러오는 중...</div>;
    }

    if (reviews.length === 0) {
        return <div style={{padding: '20px', textAlign: 'center'}}>작성된 리뷰가 없습니다.</div>;
    }

    return (
        <div className="review-list-container" style={{maxWidth: '1100px', margin: '0 auto'}}>
            <h2 style={{padding: '0 28px'}}>리뷰 (총 {reviews.length}개)</h2>
            
            {reviews.map((review) => (
                // 4. 각 리뷰 데이터를 'reviewData'라는 prop으로 전달
                // 'key'는 React가 각 항목을 구별하기 위해 필수입니다.
                <ReviewDetail 
                    key={review.reviewNo} 
                    reviewData={review} 
                    onDelete={handleDeleteReview}
                />
            ))}
        </div>
    );
}

export default ProductReviews;