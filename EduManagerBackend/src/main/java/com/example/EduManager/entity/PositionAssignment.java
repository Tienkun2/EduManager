// 4. Chức vụ và Phân công chức vụ được gộp thành một
package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Table(name = "position_assignments")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PositionAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    String positionName; // Tên chức vụ
    String description; // Mô tả chức vụ
    Double allowanceCoefficient; // Hệ số phụ cấp chức vụ

    @ManyToOne
    @JoinColumn(name = "department_id") // Đơn vị giữ chức vụ (có thể khác với đơn vị trực thuộc)
    Department positionDepartment;

    LocalDate startDate;
    LocalDate endDate; // null nếu đang giữ chức vụ
    boolean isActive; // Trạng thái hoạt động
}
// Chức vụ có thể là Giảng viên chính, Trưởng khoa, Phó trưởng khoa, Trưởng bộ môn, Phó trưởng bộ môn, Giảng viên, Nhân viên hành chính