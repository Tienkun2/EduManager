package com.example.EduManager.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BroadcastNotificationCreationRequest {
    @NotBlank(message = "Notification ID is required")
    private String notificationId;

    private String targetRole; // Vai trò mục tiêu (null nếu không lọc theo role)
    private String targetDepartmentId; // Đơn vị mục tiêu (null nếu không lọc)
    private String targetStaffTypeId; // Loại nhân sự mục tiêu (null nếu không lọc)
}