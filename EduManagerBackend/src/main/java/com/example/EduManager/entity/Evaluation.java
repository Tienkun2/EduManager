// 7. Đánh giá kết hợp với khen thưởng/kỷ luật
package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "evaluations")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Evaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    String academicYear;
    String semester;
    String evaluationType; // Đánh giá định kỳ/Khen thưởng/Kỷ luật
    String result;
    String comments;
    String evaluator;
    LocalDate evaluationDate;

    // Chỉ áp dụng cho khen thưởng/kỷ luật
    String decisionNumber; // Số quyết định (nếu có)
    String form; // Hình thức khen thưởng/kỷ luật
    String reason; // Lý do
}
