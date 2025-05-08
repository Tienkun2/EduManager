package com.example.EduManager.entity;

import com.example.EduManager.Enum.NotificationAction;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Table(name = "notification_logs")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NotificationLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    @ManyToOne
    @JoinColumn(name = "notification_id", nullable = false)
    Notification notification; // Thông báo liên quan

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    NotificationAction action; // Hành động (SENT, READ, PROCESSED)

    @ManyToOne
    @JoinColumn(name = "action_by")
    User actionBy; // Người thực hiện hành động

    @Column(nullable = false)
    LocalDateTime actionAt; // Thời gian hành động
}