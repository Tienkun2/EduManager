package com.example.EduManager.dto.request;

import com.example.EduManager.Enum.NotificationStatus;
import com.example.EduManager.Enum.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationCreationRequest {
    @NotBlank(message = "Sender ID is required")
    private String senderId;

    private String receiverId; // Có thể null nếu là thông báo hàng loạt

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotNull(message = "Type is required")
    private NotificationType type;
}