package com.shoppingmallcoco.project.entity.order; // 'entity' 패키지

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate; // 'DATE' 타입이므로 LocalDate 사용
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Entity
@Table(name = "\"ORDER\"") // ERD의 "ORDER"와 연결
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq_gen")
    @SequenceGenerator(name = "order_seq_gen", sequenceName = "order_SEQ", allocationSize = 1)
    @Column(name = "orderNo")
    private Integer orderNo; // 주문 고유 번호 (NUMBER)

    @Column(name = "memNo", nullable = false)
    private Integer memNo; // 멤버 고유 번호 (NUMBER)

    @Column(name = "orderDate")
    private LocalDate orderDate; // 주문일 (DATE)

    @Column(name = "totalPrice")
    private Integer totalPrice; // 총 금액 (NUMBER)

    @Column(name = "status", length = 20)
    private String status; // 주문 상태 (VARCHAR2(20))

    // --- [최종 ERD 반영] 주소 필드 ---
    @Column(name = "orderZipcode", length = 100)
    private String orderZipcode; // 우편번호 (VARCHAR2(100))

    @Column(name = "orderAddress1", length = 100)
    private String orderAddress1; // 기본주소 (VARCHAR2(100))

    @Column(name = "orderAddress2", length = 100)
    private String orderAddress2; // 상세 주소 (VARCHAR2(100))

    // --- [최종 ERD 반영] 수령인 및 기타 정보 ---
    @Column(name = "recipientName", length = 100)
    private String recipientName; // 수령인 이름

    @Column(name = "recipientPhone", length = 20)
    private String recipientPhone; // 수령인 전화번호

    @Column(name = "deliveryMessage", length = 255)
    private String deliveryMessage; // 배송 메세지

    @Column(name = "pointsUsed")
    private Integer pointsUsed; // 사용한 포인트 (int)

    // --- (관계 설정) ---
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();
}