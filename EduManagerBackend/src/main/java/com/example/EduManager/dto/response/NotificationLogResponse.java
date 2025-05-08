package com.example.EduManager.dto.response;

import com.example.EduManager.Enum.NotificationAction;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NotificationLogResponse {
    private String id;
    private String notificationId;
    private NotificationAction action;
    private String actionById;
    private LocalDateTime actionAt;
}
