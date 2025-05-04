// 5. Trình độ học vấn và bằng cấp
package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "education")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Education {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    String degreeLevel; // Cử nhân, Thạc sĩ, Tiến sĩ
    String degreeType; // Chuyên môn, ngoại ngữ, tin học
    String major; // Chuyên ngành đào tạo
    String issuedBy; // Cơ sở đào tạo cấp bằng
    Integer graduationYear; // Năm tốt nghiệp
    String classification; // Xếp loại
    LocalDate issueDate; // Ngày cấp bằng
    String serialNumber; // Số hiệu văn bằng
}
// Chú thích: Trình độ học vấn và bằng cấp có thể được quản lý riêng biệt hoặc kết hợp với thông tin cá nhân của người dùng.