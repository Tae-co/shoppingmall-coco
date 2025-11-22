package com.shoppingmallcoco.project.controller;

import com.shoppingmallcoco.project.dto.review.ReviewDTO;
import com.shoppingmallcoco.project.dto.review.TagDTO;
import com.shoppingmallcoco.project.entity.review.Tag;
import com.shoppingmallcoco.project.repository.order.OrderItemRepository;
import com.shoppingmallcoco.project.repository.review.ReviewRepository;
import com.shoppingmallcoco.project.service.review.ReviewService;
import com.shoppingmallcoco.project.service.review.TagService;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {

    private final ReviewService reviewService;
    private final TagService tagService;
    private final OrderItemRepository orderItemRepository;
    private final ReviewRepository reviewRepository;

    // 리뷰 작성 페이지 데이터 저장
    @PostMapping("/reviews")
    public Long insertReview(@RequestPart("reviewDTO") ReviewDTO reviewDTO,
        @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        Long reviewNo = reviewService.insertReview(reviewDTO, files);
        return reviewNo;
    }


    // 리뷰 수정페이지 데이터 조회
    @GetMapping("/reviews/{reviewNo}")
    public ReviewDTO getReview(@PathVariable Long reviewNo) {
        return reviewService.getReview(reviewNo);
    }


    // 리뷰 수정 데이터 저장
    @PutMapping("/reviews/{reviewNo}")
    public void updateReview(@PathVariable long reviewNo,
        @RequestPart("reviewDTO") ReviewDTO reviewDTO,
        @RequestPart(value = "files", required = false) List<MultipartFile> files) {
        reviewService.updateReview(reviewNo, reviewDTO, files);
    }

    // 리뷰 삭제
    @DeleteMapping("/reviews/{reviewNo}")
    public void deleteReview(@PathVariable long reviewNo) {
        reviewService.delete(reviewNo);
    }

    // 리뷰 목록 조회
    @GetMapping("/products/{productNo}/reviews")
    public List<ReviewDTO> getReviews(@PathVariable long productNo) {
        return reviewService.getReviewList(productNo);
    }

    // 태그 목록 조회
    @GetMapping("api/tags")
    public List<TagDTO> getTags() {
        List<Tag> tagList = tagService.getTagList();
        List<TagDTO> tagDTOList = tagList.stream().map(TagDTO::toDTO).collect(Collectors.toList());
        return tagDTOList;
    }

    //orderItemNo 유뮤 확인
    @GetMapping("/orderItems/{orderItemNo}/check")
    public ResponseEntity<?> checkOrderItems(@PathVariable Long orderItemNo) {
        boolean exists = orderItemRepository.existsById(orderItemNo);
        if (exists) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    //reviewNo 유무 확인
    @GetMapping("/review/{reviewNo}/check")
    public ResponseEntity<?> checkReviewNo(@PathVariable Long reviewNo) {
        boolean exists = reviewRepository.existsById(reviewNo);
        if (exists) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
