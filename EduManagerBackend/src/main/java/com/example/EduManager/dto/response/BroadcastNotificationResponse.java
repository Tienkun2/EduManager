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
public class BroadcastNotificationResponse {
    private String id;
    private String notificationId;
    private String targetRole;
    private String targetDepartmentId;
    private String targetStaffTypeId;
    private LocalDateTime createdAt;
}