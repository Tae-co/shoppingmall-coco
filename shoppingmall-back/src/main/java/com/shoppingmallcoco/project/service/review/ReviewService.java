package com.shoppingmallcoco.project.service.review;

import com.shoppingmallcoco.project.dto.review.ReviewDTO;
import com.shoppingmallcoco.project.entity.OrderItem;
import com.shoppingmallcoco.project.entity.review.Review;
import com.shoppingmallcoco.project.entity.review.ReviewImage;
import com.shoppingmallcoco.project.entity.review.ReviewTagMap;
import com.shoppingmallcoco.project.entity.review.Tag;
import com.shoppingmallcoco.project.repository.review.LikeRepository;
import com.shoppingmallcoco.project.repository.OrderItemRepository;
import com.shoppingmallcoco.project.repository.review.ReviewImageRepository;
import com.shoppingmallcoco.project.repository.review.ReviewRepository;
import com.shoppingmallcoco.project.repository.review.ReviewTagMapRepository;
import com.shoppingmallcoco.project.repository.review.TagRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ReviewService {


    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final LikeRepository likeRepository;
    private final ReviewImageRepository reviewImageRepository;
    private final ReviewTagMapRepository reviewTagMapRepository;
    private final TagRepository tagRepository;
    private final FileUploadService fileUploadService;

    // review 등록
    @Transactional
    public Long insertReview(ReviewDTO reviewDTO, List<MultipartFile> files) {

        // 구매 내역 확인
        OrderItem orderItem = orderItemRepository.findById(reviewDTO.getOrderItemNo())
            .orElseThrow(() -> new IllegalArgumentException("구매내역이 없습니다."));

        // Entity로 변경

        Review review = Review.toEntity(orderItem, reviewDTO);

        // 리뷰 저장

        reviewRepository.save(review);

        // 이미지 파일 여부
        // 업로드한 파일 MultipartFile 객체에 하나씩 담기, 파일 upload, entity로 변환, 리뷰이미지에 save
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String imageUrl = fileUploadService.upload(file);

                ReviewImage reviewImage = ReviewImage.toEntity(imageUrl, review);

                reviewImageRepository.save(reviewImage);
            }
        }

        // 태그 아이디 여부, ReviewTagMap타입으로 엔티티 변환, 저장

        if (reviewDTO.getTagIds() != null && !reviewDTO.getTagIds().isEmpty()) {
            for (Long tagId : reviewDTO.getTagIds()) {
                Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new IllegalArgumentException("일치하는 태그가 없습니다."));
                ReviewTagMap reviewTagMap = ReviewTagMap.toEntity(review, tag);

                reviewTagMapRepository.save(reviewTagMap);
            }
        }

        return review.getReviewNo();
    }

    // review 수정한 내용 Update
    @Transactional
    public void updateReview(Long reviewNo, ReviewDTO reviewDTO, List<MultipartFile> files) {

        Review findReview = reviewRepository.findById(reviewNo)
            .orElseThrow(() -> new IllegalArgumentException("작성된 리뷰가 없습니다."));

        findReview.update(reviewDTO.getRating(), reviewDTO.getContent());

        List<ReviewImage> findImage = reviewImageRepository.findByReview(findReview);

        if (findImage != null && !findImage.isEmpty()) {
            for (ReviewImage image : findImage) {
                fileUploadService.delete(image.getImageUrl());
            }
        }
        reviewImageRepository.deleteByReview(findReview);

        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                String imageUrl = fileUploadService.upload(file);

                ReviewImage reviewImage = ReviewImage.toEntity(imageUrl, findReview);
                reviewImageRepository.save(reviewImage);
            }
        }

        List<ReviewTagMap> reviewTagMapList = reviewTagMapRepository.findByReview(findReview);

        if (reviewTagMapList != null && !reviewTagMapList.isEmpty()) {
            reviewTagMapRepository.deleteAll(reviewTagMapList);
        }

        if (reviewDTO.getTagIds() != null && !reviewDTO.getTagIds().isEmpty()) {
            for (Long tagId : reviewDTO.getTagIds()) {
                Tag tag = tagRepository.findById(tagId)
                    .orElseThrow(() -> new IllegalArgumentException("일치하는 태그가 없습니다."));
                ReviewTagMap reviewTagMap = ReviewTagMap.toEntity(findReview, tag);
                reviewTagMapRepository.save(reviewTagMap);
            }
        }
    }

    // review 삭제
    @Transactional
    public void delete(Long reviewNo) {

        Review findReview = reviewRepository.findById(reviewNo)
            .orElseThrow(() -> new IllegalArgumentException("해당 리뷰가 없습니다."));

        List<ReviewImage> findImage = reviewImageRepository.findByReview(findReview);

        if (findImage != null && !findImage.isEmpty()) {
            for (ReviewImage image : findImage) {
                fileUploadService.delete(image.getImageUrl());
            }
        }

        reviewRepository.deleteById(reviewNo);

        List<ReviewTagMap> reviewTagMapList = reviewTagMapRepository.findByReview(findReview);

        if (reviewTagMapList != null && !reviewTagMapList.isEmpty()) {
            reviewTagMapRepository.deleteAll(reviewTagMapList);
        }
    }

    // review 1개 조회 (수정하기 페이지)
    public ReviewDTO getReview(Long reviewNo) {
        Review findReview = reviewRepository.findById(reviewNo)
            .orElseThrow(() -> new IllegalArgumentException("리뷰 조회 에러입니다."));
        int likeCount = likeRepository.countByReview(findReview);
        ReviewDTO reviewDTO = ReviewDTO.toDto(findReview, likeCount);
        return reviewDTO;
    }

    // review 모든 목록 조회 (상품페이지에서 등록된 리뷰 목록 조회)
    public List<ReviewDTO> getReviewList(Long prdNo) {
        List<Review> findReviews = reviewRepository.findByOrderItem_PrdNo(prdNo);
        List<ReviewDTO> reviewDtoList = findReviews.stream().map(review -> {
            int likeCount = likeRepository.countByReview(review);
            return ReviewDTO.toDto(review, likeCount);
        }).collect(Collectors.toList());

        return reviewDtoList;
    }

}