package com.example.EduManager.entity;

import com.example.EduManager.Enum.NotificationStatus;
import com.example.EduManager.Enum.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    User sender; // Người gửi (admin hoặc user)

    @ManyToOne
    @JoinColumn(name = "receiver_id") // Có thể null nếu là thông báo hàng loạt
    User receiver; // Người nhận

    @Column(nullable = false)
    String title; // Tiêu đề thông báo

    @Column(columnDefinition = "TEXT", nullable = false)
    String content; // Nội dung thông báo

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    NotificationType type; // Loại thông báo (SYSTEM, PROMOTION, SUPPORT, FEEDBACK)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    NotificationStatus status; // Trạng thái (UNREAD, READ)

    @Column(nullable = false)
    LocalDateTime createdAt; // Thời gian tạo

    LocalDateTime updatedAt; // Thời gian cập nhật
}
