package com.example.EduManager.dto.request;

import com.example.EduManager.Enum.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationInfoUpdateRequest {
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
