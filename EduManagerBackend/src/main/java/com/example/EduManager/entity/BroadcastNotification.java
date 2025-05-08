package com.example.EduManager.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "broadcast_notifications")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class BroadcastNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @OneToOne
    @JoinColumn(name = "notification_id", nullable = false)
    Notification notification; // Thông báo gốc

    @Column
    String targetRole; // Vai trò mục tiêu (null nếu không lọc theo role)

    @ManyToOne
    @JoinColumn(name = "target_department_id")
    Department targetDepartment; // Đơn vị mục tiêu (null nếu không lọc theo department)

    @ManyToOne
    @JoinColumn(name = "target_staff_type_id")
    StaffType targetStaffType; // Loại nhân sự mục tiêu (null nếu không lọc theo staffType)

    @Column(nullable = false)
    LocalDateTime createdAt; // Thời gian tạo
}