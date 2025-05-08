package com.example.EduManager.dto.request;

import com.example.EduManager.Enum.NotificationStatus;
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
public class NotificationUpdateRequest {
    @NotNull(message = "Status is required")
    private NotificationStatus status;
}