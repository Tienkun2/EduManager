package com.example.EduManager.dto.response;

import com.example.EduManager.Enum.NotificationStatus;
import com.example.EduManager.Enum.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationResponse {
    private String id;
    private String senderId;
    private String receiverId;
    private String title;
    private String content;
    private NotificationType type;
    private NotificationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}